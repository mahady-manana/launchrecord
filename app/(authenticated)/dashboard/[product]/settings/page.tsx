"use client";

import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/stores/product-store";
import {
  Check,
  Edit2,
  ExternalLink,
  Globe,
  Loader2,
  Plus,
  Search,
  Share2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Topic {
  _id: string;
  name: string;
}

interface ProductSettingsProps {
  params: Promise<{ product: string }>;
}

export default function ProductSettingsPage({ params }: ProductSettingsProps) {
  const router = useRouter();
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts } = useProducts();

  const [product, setProduct] = useState<typeof selectedProduct>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isEditingTopics, setIsEditingTopics] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    website: "",
    logo: "",
  });

  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Topic[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<Topic[]>([]);

  useEffect(() => {
    async function loadProduct() {
      const { product: productId } = await params;
      await fetchProducts();

      const foundProduct = products.find(
        (p) => p.id === productId || p._id === productId,
      );
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedProduct(foundProduct);
        setFormData({
          name: foundProduct.name || "",
          tagline: foundProduct.tagline || "",
          description: foundProduct.description || "",
          website: foundProduct.website || "",
          logo: foundProduct.logo || "",
        });
        await loadTopics(productId);
      } else {
        toast.error("Product not found");
        router.push("/dashboard");
      }
    }
    loadProduct();
  }, [params]);

  const loadTopics = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/topics`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics || []);
      }
    } catch (error) {
      console.error("Error loading topics:", error);
    }
  };

  const loadSuggestedTopics = async () => {
    try {
      const response = await fetch(`/api/topics?limit=10`);
      if (response.ok) {
        const data = await response.json();
        // Filter out already selected topics
        const filtered = data.topics.filter(
          (t: Topic) => !topics.some((existing) => existing._id === t._id),
        );
        setSuggestedTopics(filtered);
      }
    } catch (error) {
      console.error("Error loading suggested topics:", error);
    }
  };

  const searchTopics = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/topics?search=${encodeURIComponent(query)}&limit=10`,
      );
      if (response.ok) {
        const data = await response.json();
        const filtered = data.topics.filter(
          (t: Topic) => !topics.some((existing) => existing._id === t._id),
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Error searching topics:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        searchTopics(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, topics]);

  // Load suggested topics when dialog opens
  useEffect(() => {
    if (isEditingTopics && suggestedTopics.length === 0) {
      loadSuggestedTopics();
    }
  }, [isEditingTopics]);

  const handleSaveInfo = async () => {
    if (!product) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          tagline: formData.tagline,
          description: formData.description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state with the saved data
        setFormData({
          ...formData,
          name: data.product.name,
          tagline: data.product.tagline,
          description: data.product.description,
        });
        toast.success("Product information updated!");
        setIsEditingInfo(false);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update product information");
      }
    } catch (error) {
      toast.error("Failed to update product information");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = async (url: string) => {
    if (!product) return;

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: url }),
      });

      if (response.ok) {
        setFormData({ ...formData, logo: url });
        toast.success("Logo updated!");
        setIsEditingLogo(false);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update logo");
      }
    } catch (error) {
      toast.error("Failed to update logo");
      console.error(error);
    }
  };

  const handleSaveWebsite = async () => {
    if (!product) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: formData.website }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, website: data.product.website });
        toast.success("Website updated!");
        setIsEditingWebsite(false);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update website");
      }
    } catch (error) {
      toast.error("Failed to update website");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTopic = async (topic: Topic) => {
    if (!product || topics.length >= 3) return;

    try {
      const response = await fetch(`/api/products/${product.id}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: topic._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics || []);
        setSearchQuery("");
        setSearchResults([]);
        toast.success("Topic added!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to add topic");
      }
    } catch (error) {
      toast.error("Failed to add topic");
      console.error(error);
    }
  };

  const handleRemoveTopic = async (topicId: string) => {
    if (!product) return;

    try {
      const response = await fetch(`/api/products/${product.id}/topics`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });

      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics || []);
        toast.success("Topic removed!");
      } else {
        toast.error("Failed to remove topic");
      }
    } catch (error) {
      toast.error("Failed to remove topic");
      console.error(error);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* PH-Style Hero Header */}
      <div className="relative bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50 border-b border-orange-100">
        {/* Content Container */}
        <div className="relative max-w-5xl mx-auto px-6 pb-8 pt-8">
          {/* Logo */}
          <div className="relative mb-6">
            <div className="relative inline-block">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt={product.name}
                  className="h-32 w-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center border-4 border-white shadow-xl">
                  <Globe className="h-14 w-14 text-white" />
                </div>
              )}
              {/* Edit Logo Button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full p-0 shadow-lg bg-white hover:bg-white"
                onClick={() => setIsEditingLogo(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {formData.name}
              </h1>
              {formData.tagline && (
                <p className="text-lg text-slate-600 font-medium">
                  {formData.tagline}
                </p>
              )}
              {formData.description && (
                <p className="text-sm text-slate-600 max-w-2xl line-clamp-2">
                  {formData.description}
                </p>
              )}

              {/* Topics */}
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {topics.map((topic) => (
                    <span
                      key={topic._id}
                      className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full"
                    >
                      {topic.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsEditingInfo(true)}
              >
                <Edit2 className="h-4 w-4" />
                Edit Info
              </Button>
              {formData.website && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(formData.website, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingWebsite(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Description Section */}
        {formData.description && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
            <p className="text-slate-600 leading-relaxed">
              {formData.description}
            </p>
          </section>
        )}

        {/* Topics Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Topics</h2>
              <p className="text-sm text-slate-500">
                Categories that describe your product (max 3)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingTopics(true)}
              disabled={topics.length >= 3}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          </div>

          {topics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <div
                  key={topic._id}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-full"
                >
                  <span className="text-sm font-medium text-orange-900">
                    {topic.name}
                  </span>
                  <button
                    onClick={() => handleRemoveTopic(topic._id)}
                    className="text-orange-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-slate-200 rounded-lg">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No topics added yet</p>
              <p className="text-xs mt-1">
                Add up to 3 topics to describe your product
              </p>
            </div>
          )}
        </section>

        {/* Website Section */}
        {formData.website && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900">Website</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingWebsite(true)}
                className="h-8 text-xs"
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </div>
            <a
              href={formData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              {formData.website}
            </a>
          </section>
        )}
      </div>

      {/* Edit Info Dialog */}
      <Dialog open={isEditingInfo} onOpenChange={setIsEditingInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product Information</DialogTitle>
            <DialogDescription>
              Update your product&apos;s basic details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="One-liner that describes your product"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your product"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingInfo(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInfo} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Logo Dialog */}
      <Dialog open={isEditingLogo} onOpenChange={setIsEditingLogo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Logo</DialogTitle>
            <DialogDescription>
              Upload a new logo for your product
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-20 w-20 rounded-lg object-cover border-2"
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Globe className="h-10 w-10 text-slate-400" />
                </div>
              )}
              <div className="flex-1">
                <ImageUpload
                  value={formData.logo}
                  onChange={handleLogoChange}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Website Dialog */}
      <Dialog open={isEditingWebsite} onOpenChange={setIsEditingWebsite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Website URL</DialogTitle>
            <DialogDescription>
              Update your product&apos;s website URL
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://yourproduct.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditingWebsite(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveWebsite} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Topics Dialog */}
      <Dialog open={isEditingTopics} onOpenChange={setIsEditingTopics}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Topics</DialogTitle>
            <DialogDescription>
              Search and add up to 3 topics to describe your product
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Selected Topics */}
            {topics.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Topics ({topics.length}/3)</Label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <div
                      key={topic._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full"
                    >
                      <span className="text-xs font-medium text-orange-900">
                        {topic.name}
                      </span>
                      <button
                        onClick={() => handleRemoveTopic(topic._id)}
                        className="text-orange-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <Label>Search Results</Label>
                {searchResults.map((topic) => (
                  <button
                    key={topic._id}
                    onClick={() => handleAddTopic(topic)}
                    disabled={topics.length >= 3}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-lg border transition-colors",
                      topics.length >= 3
                        ? "bg-slate-100 cursor-not-allowed border-slate-200"
                        : "hover:bg-slate-50 border-slate-200",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        topics.length >= 3 ? "text-slate-400" : "",
                      )}
                    >
                      {topic.name}
                    </span>
                    {topics.length >= 3 ? (
                      <Check className="h-4 w-4 text-slate-300" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            ) : suggestedTopics.length > 0 && !searchQuery ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <Label>Suggested Topics</Label>
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic._id}
                    onClick={() => handleAddTopic(topic)}
                    disabled={topics.length >= 3}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-lg border transition-colors",
                      topics.length >= 3
                        ? "bg-slate-100 cursor-not-allowed border-slate-200"
                        : "hover:bg-slate-50 border-slate-200",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        topics.length >= 3 ? "text-slate-400" : "",
                      )}
                    >
                      {topic.name}
                    </span>
                    {topics.length >= 3 ? (
                      <Check className="h-4 w-4 text-slate-300" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                ))}
              </div>
            ) : null}

            {searchQuery && searchResults.length === 0 && !isSearching && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No topics found for &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
