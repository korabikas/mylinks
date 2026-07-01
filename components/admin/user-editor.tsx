"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link as LinkModel, User } from "@prisma/client";
import { GripVertical, Trash2, Plus, ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";

interface UserEditorProps {
  user: User & { links: LinkModel[] };
  isNew?: boolean;
  selfEdit?: boolean;
}

const AVAILABLE_ICONS = [
  "Instagram",
  "Twitter",
  "Youtube",
  "Music",
  "Coffee",
  "Globe",
  "Link",
  "Heart",
  "Star",
  "Mail",
  "Github",
  "Linkedin",
  "Facebook",
  "ShoppingBag",
  "Sparkles",
  "Crown",
  "Send",
  "Wallet",
  "Banknote",
  "Clapperboard",
  "Video",
  "MapPin",
];

function SortableLinkItem({
  link,
  onEdit,
  onDelete,
}: {
  link: LinkModel;
  onEdit: (id: string, updates: Partial<LinkModel>) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-3 rounded-lg border bg-white p-3 shadow-sm dark:bg-zinc-900"
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab text-zinc-400 hover:text-zinc-600"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="grid flex-1 gap-2 sm:grid-cols-4">
          <Input
            placeholder="Title"
            value={link.title}
            onChange={(e) => onEdit(link.id, { title: e.target.value })}
            className="sm:col-span-1"
          />
          <Input
            placeholder="https://..."
            value={link.url}
            onChange={(e) => onEdit(link.id, { url: e.target.value })}
            className="sm:col-span-2"
          />
          <Select
            value={link.icon || "none"}
            onValueChange={(v) =>
              onEdit(link.id, { icon: v === "none" ? null : v })
            }
          >
            <SelectTrigger className="sm:col-span-1">
              <SelectValue placeholder="Icon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No icon</SelectItem>
              {AVAILABLE_ICONS.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="sm:col-span-2">
            <ImageUpload
              label="Cover image"
              value={link.coverImage || ""}
              onChange={(url) => onEdit(link.id, { coverImage: url })}
            />
          </div>
          <Input
            placeholder="Showing link text (optional)"
            value={link.displayUrl || ""}
            onChange={(e) => onEdit(link.id, { displayUrl: e.target.value })}
            className="sm:col-span-2"
          />
        </div>
        <div className="flex flex-col items-end gap-2 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Active</span>
            <Switch
              checked={link.active}
              onCheckedChange={(checked) => onEdit(link.id, { active: checked })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">18+</span>
            <Switch
              checked={link.nsfw}
              onCheckedChange={(checked) => onEdit(link.id, { nsfw: checked })}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(link.id)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function UserEditor({ user, isNew, selfEdit }: UserEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    name: user.name,
    bio: user.bio || "",
    location: user.location || "",
    avatar: user.avatar || "",
    backgroundType: user.backgroundType,
    backgroundValue: user.backgroundValue,
    buttonColor: user.buttonColor,
    buttonTextColor: user.buttonTextColor,
    buttonStyle: user.buttonStyle,
    password: "",
  });
  const [links, setLinks] = useState<LinkModel[]>(user.links);
  const [linkUpdates, setLinkUpdates] = useState<Record<string, Partial<LinkModel>>>({});
  const [deletedLinkIds, setDeletedLinkIds] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkEdit = (id: string, updates: Partial<LinkModel>) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );
    setLinkUpdates((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleAddLink = () => {
    const newLink: LinkModel = {
      id: `temp-${Date.now()}`,
      title: "New Link",
      url: "https://",
      displayUrl: null,
      icon: "Link",
      coverImage: null,
      nsfw: false,
      order: links.length,
      active: true,
      clicks: 0,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLinks((prev) => [...prev, newLink]);
    setLinkUpdates((prev) => ({ ...prev, [newLink.id]: newLink }));
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
    setDeletedLinkIds((prev) => [...prev, id]);
    setLinkUpdates((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        const updates: Record<string, Partial<LinkModel>> = {};
        reordered.forEach((link, index) => {
          if (link.order !== index) {
            updates[link.id] = { ...updates[link.id], order: index };
          }
        });
        setLinkUpdates((prev) => ({ ...prev, ...updates }));
        return reordered;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: Record<string, unknown> = { ...form };
      if (selfEdit) {
        delete payload.password;
      }
      if (isNew && !form.password) {
        toast.error("Password is required for new users");
        setSaving(false);
        return;
      }

      let userId = user.id;
      let userRes: Response;

      if (selfEdit) {
        userRes = await fetch("/api/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else if (isNew) {
        userRes = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        userRes = await fetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!userRes.ok) {
        const data = await userRes.json();
        throw new Error(data.error || "Failed to save user");
      }

      if (!selfEdit) {
        const savedUser = await userRes.json();
        userId = savedUser.id;
      }

      const linkBase = selfEdit ? "/api/me/links" : "/api/admin/links";

      // Save new links
      for (const link of links.filter((l) => l.id.startsWith("temp-"))) {
        const body: Record<string, unknown> = {
          title: link.title,
          url: link.url,
          displayUrl: link.displayUrl,
          icon: link.icon,
          coverImage: link.coverImage,
          nsfw: link.nsfw,
          active: link.active,
        };
        if (!selfEdit) body.userId = userId;

        const res = await fetch(linkBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error?.url?.[0] || data.error?.title?.[0] || `Failed to create link: ${link.title}`);
        }
      }

      // Update existing links
      for (const [id, updates] of Object.entries(linkUpdates)) {
        if (id.startsWith("temp-")) continue;
        if (deletedLinkIds.includes(id)) continue;
        const res = await fetch(`${linkBase}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error?.url?.[0] || data.error?.title?.[0] || `Failed to update link`);
        }
      }

      // Delete links
      for (const id of deletedLinkIds) {
        if (id.startsWith("temp-")) continue;
        await fetch(`${linkBase}/${id}`, { method: "DELETE" });
      }

      // Reorder
      const reorderIds = links.filter((l) => !l.id.startsWith("temp-")).map((l) => l.id);
      if (reorderIds.length > 0) {
        const reorderBody: Record<string, unknown> = { linkIds: reorderIds };
        if (!selfEdit) reorderBody.userId = userId;
        await fetch(linkBase, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reorderBody),
        });
      }

      toast.success(isNew ? "User created" : "Profile saved");
      if (isNew) {
        router.push(`/admin/dashboard/users/${userId}`);
      } else {
        // Fetch fresh data so temp link IDs are replaced with real ones
        const freshRes = await fetch(selfEdit ? "/api/me" : `/api/admin/users/${userId}`);
        if (freshRes.ok) {
          const freshUser = await freshRes.json();
          setLinks(freshUser.links);
          setLinkUpdates({});
          setDeletedLinkIds([]);
        }
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {selfEdit ? "My Profile" : isNew ? "New User" : `Edit @${user.username}`}
        </h1>
        <div className="flex gap-2">
          {!isNew && (
            <Link href={`/${user.username}`} target="_blank">
              <Button type="button" variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </Link>
          )}
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    required
                    disabled={selfEdit}
                    className={selfEdit ? "bg-zinc-100 text-zinc-500" : ""}
                  />
                  {selfEdit && (
                    <p className="text-xs text-zinc-500">Contact an admin to change your username.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    disabled={selfEdit}
                    className={selfEdit ? "bg-zinc-100 text-zinc-500" : ""}
                  />
                  {selfEdit && (
                    <p className="text-xs text-zinc-500">Contact an admin to change your email.</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="City, country"
                />
              </div>
              <div className="space-y-2">
                <ImageUpload
                  label="Avatar"
                  value={form.avatar || ""}
                  onChange={(url) => handleChange("avatar", url)}
                />
              </div>
              {!selfEdit && (
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {isNew ? "Password" : "New Password (leave blank to keep)"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="backgroundType">Background Type</Label>
                  <Select
                    value={form.backgroundType}
                    onValueChange={(v) => handleChange("backgroundType", v || "color")}
                  >
                    <SelectTrigger id="backgroundType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="image">Image URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonStyle">Button Shape</Label>
                  <Select
                    value={form.buttonStyle}
                    onValueChange={(v) => handleChange("buttonStyle", v || "rounded")}
                  >
                    <SelectTrigger id="buttonStyle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="pill">Pill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="backgroundValue">
                    {form.backgroundType === "color" ? "Background Color" : "Image URL"}
                  </Label>
                  <div className="flex gap-2">
                    {form.backgroundType === "color" && (
                      <input
                        type="color"
                        value={form.backgroundValue}
                        onChange={(e) => handleChange("backgroundValue", e.target.value)}
                        className="h-10 w-10 rounded border p-1"
                      />
                    )}
                    <Input
                      id="backgroundValue"
                      value={form.backgroundValue}
                      onChange={(e) => handleChange("backgroundValue", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonColor">Button Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={form.buttonColor}
                      onChange={(e) => handleChange("buttonColor", e.target.value)}
                      className="h-10 w-10 rounded border p-1"
                    />
                    <Input
                      id="buttonColor"
                      value={form.buttonColor}
                      onChange={(e) => handleChange("buttonColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonTextColor">Button Text Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.buttonTextColor}
                    onChange={(e) => handleChange("buttonTextColor", e.target.value)}
                    className="h-10 w-10 rounded border p-1"
                  />
                  <Input
                    id="buttonTextColor"
                    value={form.buttonTextColor}
                    onChange={(e) => handleChange("buttonTextColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Links</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={handleAddLink}>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={links.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {links.map((link) => (
                    <SortableLinkItem
                      key={link.id}
                      link={link}
                      onEdit={handleLinkEdit}
                      onDelete={handleDeleteLink}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {links.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No links yet. Click Add Link to start.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
