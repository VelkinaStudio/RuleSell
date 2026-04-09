"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/hooks/use-session";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";

export default function SettingsProfilePage() {
  const t = useTranslations("dashboard.settings");
  const tProfile = useTranslations("dashboard.settings.profile");
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailMentions, setEmailMentions] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

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
              <AvatarFallback className="bg-bg-raised text-base font-semibold text-fg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button type="button" size="sm" variant="outline">
              {tProfile("avatarUpload")}
            </Button>
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
              maxLength={240}
              rows={3}
              placeholder=""
            />
            <p className="text-[11px] text-fg-subtle">{tProfile("bioHint")}</p>
          </div>
        </section>

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
