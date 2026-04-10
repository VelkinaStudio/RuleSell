"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/hooks/use-session";
import { ConnectedAccounts } from "@/components/dashboard/connected-accounts";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";

const BIO_MAX = 240;

export default function SettingsProfilePage() {
  const t = useTranslations("dashboard.settings");
  const tProfile = useTranslations("dashboard.settings.profile");
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailMentions, setEmailMentions] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "rulesell:profile-draft",
        JSON.stringify({
          name,
          bio,
          notifications: { emailDigest, emailMentions, emailUpdates },
        }),
      );
    }
    toast.success(tProfile("saved"));
  };

  const initials = (user?.username ?? "")
    .split(/[-_ ]+/)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  const bioLength = bio.length;
  const bioNearLimit = bioLength >= BIO_MAX * 0.9;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-fg-muted">{t("subtitle")}</p>
      </header>

      <SettingsTabs />

      <form onSubmit={handleSave} className="space-y-8">
        <section className="space-y-4 rounded-xl border border-border-soft bg-bg-surface p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="h-16 w-16 border border-border-soft">
              {avatarPreview && (
                <AvatarImage src={avatarPreview} alt={tProfile("avatar")} />
              )}
              <AvatarFallback className="bg-bg-raised text-base font-semibold text-fg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {tProfile("avatarUpload")}
              </Button>
              {avatarPreview && (
                <p className="text-[11px] text-brand">
                  {tProfile("avatarPreviewHint")}
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label={tProfile("avatarUpload")}
              onChange={handleAvatarChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="display-name">{tProfile("displayName")}</Label>
              <Input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={64}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">{tProfile("username")}</Label>
              <Input
                id="username"
                value={user?.username ?? ""}
                readOnly
                className="bg-bg-raised text-fg-muted"
              />
              <p className="text-[11px] text-fg-subtle">
                {tProfile("usernameHint")}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">{tProfile("bio")}</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={BIO_MAX}
              rows={3}
              placeholder=""
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-fg-subtle">{tProfile("bioHint")}</p>
              <p
                className={`text-[11px] tabular-nums ${bioNearLimit ? "text-amber-400" : "text-fg-subtle"}`}
                aria-live="polite"
              >
                {bioLength}/{BIO_MAX}
              </p>
            </div>
          </div>
        </section>

        <ConnectedAccounts />

        <section className="space-y-4 rounded-xl border border-border-soft bg-bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">
            {tProfile("notifications")}
          </h2>
          <div className="space-y-3">
            <NotificationRow
              id="email-digest"
              label={tProfile("emailDigest")}
              checked={emailDigest}
              onCheckedChange={setEmailDigest}
            />
            <NotificationRow
              id="email-mentions"
              label={tProfile("emailMentions")}
              checked={emailMentions}
              onCheckedChange={setEmailMentions}
            />
            <NotificationRow
              id="email-updates"
              label={tProfile("emailUpdates")}
              checked={emailUpdates}
              onCheckedChange={setEmailUpdates}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-brand text-brand-fg hover:bg-brand/90"
          >
            <Check className="mr-1 h-4 w-4" />
            {tProfile("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}

function NotificationRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 rounded-md border border-border-soft bg-bg-raised/40 px-3 py-2.5 text-sm text-fg cursor-pointer transition hover:border-border-strong"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
      />
      <span>{label}</span>
    </label>
  );
}
