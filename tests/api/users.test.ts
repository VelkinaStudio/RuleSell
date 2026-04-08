import { describe, it, expect, beforeAll } from "vitest";
import { login, getJSON, ACCOUNTS, BASE_URL, type AuthSession } from "../helpers";

interface ProfileResponse {
  data: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    reputation: number;
    role: string;
    createdAt: string;
    stats: {
      rulesetCount: number;
      totalDownloads: number;
      totalSales: number;
      followerCount: number;
      followingCount: number;
      avgRating: number;
    };
    isFollowing: boolean;
  };
}

let bob: AuthSession;
let alice: AuthSession;

beforeAll(async () => {
  bob = await login(ACCOUNTS.bob.email, ACCOUNTS.bob.password);
  alice = await login(ACCOUNTS.alice.email, ACCOUNTS.alice.password);
});

describe("GET /api/users/[username]", () => {
  it("returns public profile for unauthenticated request", async () => {
    const { status, body } = await getJSON<ProfileResponse>(
      `/api/users/alicechen`,
    );
    expect(status).toBe(200);
    expect(body.data.username).toBe("alicechen");
    expect(body.data.name).toBeTruthy();
    expect(body.data.role).toBe("PRO");
    expect(body.data.isFollowing).toBe(false);
    expect(typeof body.data.createdAt).toBe("string");
  });

  it("returns 404 for unknown username", async () => {
    const { status } = await getJSON(`/api/users/definitely-not-a-real-user`);
    expect(status).toBe(404);
  });

  it("does not expose email, passwordHash, or internal fields", async () => {
    const { body } = await getJSON<Record<string, unknown>>(
      `/api/users/alicechen`,
    );
    const data = body.data as Record<string, unknown>;
    expect(data).not.toHaveProperty("email");
    expect(data).not.toHaveProperty("passwordHash");
    expect(data).not.toHaveProperty("emailVerified");
    expect(data).not.toHaveProperty("emailVerifyToken");
    expect(data).not.toHaveProperty("resetPasswordToken");
    expect(data).not.toHaveProperty("resetPasswordExpires");
    expect(data).not.toHaveProperty("sellerStatus");
    expect(data).not.toHaveProperty("lemonsqueezyCustomerId");
    expect(data).not.toHaveProperty("totalEarnings");
  });

  it("returns stats block with numeric fields", async () => {
    const { body } = await getJSON<ProfileResponse>(`/api/users/alicechen`);
    const { stats } = body.data;
    expect(typeof stats.rulesetCount).toBe("number");
    expect(typeof stats.totalDownloads).toBe("number");
    expect(typeof stats.totalSales).toBe("number");
    expect(typeof stats.followerCount).toBe("number");
    expect(typeof stats.followingCount).toBe("number");
    expect(typeof stats.avgRating).toBe("number");
    // Alice is the primary seed seller — she should have published rulesets.
    expect(stats.rulesetCount).toBeGreaterThan(0);
  });

  it("returns isFollowing=false when user does not follow the profile", async () => {
    // Make sure bob is NOT following alice (toggle twice if he is).
    const { body: before } = await bob.getJSON<ProfileResponse>(
      `/api/users/alicechen`,
    );
    if (before.data.isFollowing) {
      await bob.postJSON("/api/follow", { userId: before.data.id });
    }
    const { status, body } = await bob.getJSON<ProfileResponse>(
      `/api/users/alicechen`,
    );
    expect(status).toBe(200);
    expect(body.data.isFollowing).toBe(false);
  });

  it("returns isFollowing=true after bob follows alice, then cleans up", async () => {
    const { body: profile } = await bob.getJSON<ProfileResponse>(
      `/api/users/alicechen`,
    );
    const aliceId = profile.data.id;
    const followerCountBefore = profile.data.stats.followerCount;

    // Ensure starting state is "not following" — toggle off if needed.
    if (profile.data.isFollowing) {
      await bob.postJSON("/api/follow", { userId: aliceId });
    }

    // Follow
    const followRes = await bob.postJSON<{ data: { following: boolean } }>(
      "/api/follow",
      { userId: aliceId },
    );
    expect(followRes.status).toBe(200);

    const { body: after } = await bob.getJSON<ProfileResponse>(
      `/api/users/alicechen`,
    );
    expect(after.data.isFollowing).toBe(true);
    expect(after.data.stats.followerCount).toBe(followerCountBefore + 1);

    // Cleanup — unfollow
    await bob.postJSON("/api/follow", { userId: aliceId });

    const { body: cleaned } = await bob.getJSON<ProfileResponse>(
      `/api/users/alicechen`,
    );
    expect(cleaned.data.isFollowing).toBe(false);
  });

  it("returns isFollowing=false when inspecting own profile", async () => {
    const { status, body } = await alice.getJSON<ProfileResponse>(
      `/api/users/alicechen`,
    );
    expect(status).toBe(200);
    expect(body.data.isFollowing).toBe(false);
  });

  it("is reachable directly via the BASE_URL constant", async () => {
    const res = await fetch(`${BASE_URL}/api/users/bobdev`);
    expect(res.status).toBe(200);
  });
});
