"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { addMyToy } from "@/lib/myToyListings";
import { loadProfile } from "@/lib/profile";
import {
  MultipleImagesInput,
  TextareaInput,
  TextInput,
  formButtonPrimaryClass,
  formButtonSecondaryClass,
  formCardClass,
  formSubtitleClass,
  formTitleClass,
} from "@/components/inputs";

const emptyForm = () => ({
  title: "",
  description: "",
  location: "",
  condition: "",
  ageRange: "",
  category: "",
});

export default function AddToyFormClient() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);

  const handleFilesChange = useCallback((files) => {
    setImageFiles(files);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (imageFiles.length === 0) return;

    const imageUrls = imageFiles.map((f) => URL.createObjectURL(f));

    const id = `mine-${Date.now()}`;
    const listedOn = new Date().toISOString().slice(0, 10);
    const { username } = loadProfile();
    const toy = {
      id,
      title: form.title.trim(),
      imageUrl: imageUrls[0],
      images: [...imageUrls],
      listedBy: "You",
      ownerUsername: username,
      listedOn,
      rating: 5,
      location: form.location.trim() || "—",
      description: form.description.trim() || "No description provided.",
      details: [
        { label: "Condition", value: form.condition.trim() || "—" },
        { label: "Age range", value: form.ageRange.trim() || "—" },
        { label: "Category", value: form.category.trim() || "Uncategorized" },
      ],
    };

    addMyToy(toy);
    router.push("/toybox/my-toys");
  };

  const handleCancel = () => {
    router.push("/toybox/my-toys");
  };

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col lg:max-h-[min(calc(100dvh-5.5rem),900px)]">
      <Link
        href="/toybox/my-toys"
        className="mb-3 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#00C4D9] hover:text-[#00ACC1]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to My Toys
      </Link>

      <div className={formCardClass}>
        <div className="shrink-0 border-b border-slate-100 pb-3">
          <h1 className={formTitleClass}>Add a new toy</h1>
          <p className={formSubtitleClass}>
            Photos and details match what appears on marketplace listings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto lg:overflow-hidden lg:pr-1"
        >
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:gap-8">
            <div className="flex min-h-0 flex-col gap-3">
              <TextInput
                id="add-toy-title"
                name="title"
                label="Title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Wooden train set"
              />

              <div className="min-h-0 shrink-0">
                <MultipleImagesInput
                  id="add-toy-images-input"
                  name="images"
                  label="Photos (up to 8)"
                  variant="compact"
                  maxFiles={8}
                  onFilesChange={handleFilesChange}
                  ariaLabel="Toy photos"
                />
                {imageFiles.length === 0 && (
                  <p className="mt-1 text-xs text-amber-700">Add at least one image to publish.</p>
                )}
              </div>

              <div className="flex min-h-0 flex-1 flex-col">
                <TextareaInput
                  id="add-toy-description"
                  name="description"
                  label="Description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Condition, what’s included, and anything buyers should know."
                  className="min-h-[4.5rem] flex-1 resize-none lg:min-h-0"
                />
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-2 content-start gap-x-3 gap-y-3 lg:gap-x-4">
              <TextInput
                id="add-toy-location"
                name="location"
                label="Location"
                required
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="City, neighborhood"
              />
              <TextInput
                id="add-toy-category"
                name="category"
                label="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Trains & vehicles"
              />
              <TextInput
                id="add-toy-condition"
                name="condition"
                label="Condition"
                value={form.condition}
                onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                placeholder="e.g. Very good"
              />
              <TextInput
                id="add-toy-age"
                name="ageRange"
                label="Age range"
                value={form.ageRange}
                onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))}
                placeholder="e.g. 3–8 years"
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:justify-end sm:gap-3">
            <button type="button" onClick={handleCancel} className={formButtonSecondaryClass}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={imageFiles.length === 0}
              className={formButtonPrimaryClass}
            >
              <Plus className="h-4 w-4" />
              Publish listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
