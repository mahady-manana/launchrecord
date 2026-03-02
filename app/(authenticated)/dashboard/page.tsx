"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Download,
  MessageSquare,
  Share2,
  Zap,
} from "lucide-react";
import { useState } from "react";

const dashboardData = {
  burnList: [
    {
      item: "Premium Designer Stroller",
      savings: "$800+",
      reason:
        "Most parents switch strollers anyway. Budget option works just as well.",
    },
    {
      item: "Multiple Bassinet Options",
      savings: "$400",
      reason: "Pick ONE. Bedroom real estate is precious.",
    },
    {
      item: "Newborn Clothes in Bulk",
      savings: "$200",
      reason: "They outgrow newborn size in 4 weeks. 8-10 pieces max.",
    },
    {
      item: "Premium Swaddles/Bamboo Wraps",
      savings: "$120",
      reason: "Cotton burp cloths work perfectly. Save for quality items.",
    },
  ],
  matchmaker: [
    {
      category: "Stroller",
      description: "Your lifestyle: City Walker → Lightweight = Key",
      pick: {
        name: "The Gold Standard",
        price: "$450-600",
        example: "UPPAbaby Minu V2",
        why: "Smooth ride, reversible seat, still compact. Best balance.",
      },
    },
    {
      category: "Car Seat",
      description: "Your lifestyle: Car dependent → Safety + Durability",
      pick: {
        name: "The Gold Standard",
        price: "$250-350",
        example: "UPPAbaby Mesa / Nuna Pipa",
        why: "Premium safety features. Lasts through extended phase. Great resale.",
      },
    },
    {
      category: "Crib/Bassinet",
      description: "Your lifestyle: Apartment living → Space-saver",
      pick: {
        name: "The Gold Standard",
        price: "$300-500",
        example: "Babyletto Hudson / SNOO Smart Bassinet",
        why: "Better mattress support. SNOO helps with soothing. Worth it.",
      },
    },
  ],
  monthlyRoadmap: [
    {
      month: "Month 0 (Now - Before Baby)",
      color: "bg-red-50 border-red-300",
      items: [
        { priority: "CRITICAL", item: "Car seat (required by law)" },
        { priority: "CRITICAL", item: "Crib or Bassinet" },
        { priority: "CRITICAL", item: "Sleep sacks (4-5)" },
        { priority: "CRITICAL", item: "Newborn diapers (size N)" },
        {
          priority: "HIGH",
          item: "Bottles (10-12) + sterilizer (if bottle feeding)",
        },
        { priority: "HIGH", item: "Newborn/0-3m onesies (8-10)" },
      ],
    },
  ],
};

export default function DashboardPage() {
  const [showBurnDetails, setShowBurnDetails] = useState<string | null>(null);
  const [showMatchmakerDetails, setShowMatchmakerDetails] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState("burn-list");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge className="mx-auto bg-blue-100 text-blue-800 border-blue-300 text-base py-2 px-4">
            🚀 Early Buyer Preview
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            Your Baby Gear Roadmap
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Essential essentials curated for you. More detailed guides coming
            soon for full members.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Plan
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Send Feedback
          </Button>
        </div>

        {/* Three-Zone Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="burn-list" className="gap-2">
              🔴 Burn List
            </TabsTrigger>
            <TabsTrigger value="matchmaker" className="gap-2">
              🟢 Matchmaker
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-2">
              🔵 Roadmap
            </TabsTrigger>
          </TabsList>

          {/* BURN LIST TAB */}
          <TabsContent value="burn-list" className="space-y-6">
            <Card className="border-2 border-red-300 bg-red-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-red-700 text-2xl">
                      <AlertCircle className="h-6 w-6" />
                      The Burn List
                    </CardTitle>
                    <CardDescription className="text-red-600">
                      Items you should SKIP (Save $400-600+)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-red-800 font-medium">
                  Most expensive parenting mistakes. Here's what NOT to buy:
                </p>
                <div className="grid gap-4">
                  {dashboardData.burnList.map((item, idx) => (
                    <Card
                      key={idx}
                      className="bg-white border border-red-200 hover:shadow-md transition-shadow"
                    >
                      <CardContent
                        className="p-4 cursor-pointer"
                        onClick={() =>
                          setShowBurnDetails(
                            showBurnDetails === item.item ? null : item.item,
                          )
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              ✕ {item.item}
                            </h3>
                            <p className="text-sm text-red-600 font-medium mt-1">
                              Save: {item.savings}
                            </p>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                              showBurnDetails === item.item ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                        {showBurnDetails === item.item && (
                          <div className="mt-4 pt-4 border-t border-red-200">
                            <p className="text-sm text-foreground">
                              {item.reason}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Total Savings */}
                <Card className="bg-gradient-to-r from-red-100 to-red-50 border border-red-300 mt-6">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700 font-medium">
                        Total Potential Savings
                      </p>
                      <p className="text-3xl font-bold text-red-700 mt-1">
                        $410-1,510
                      </p>
                    </div>
                    <div className="text-4xl">💰</div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MATCHMAKER TAB */}
          <TabsContent value="matchmaker" className="space-y-6">
            <Card className="border-2 border-green-300 bg-green-50">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-green-700 text-2xl">
                    <Zap className="h-6 w-6" />
                    3-Option Matchmaker
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Three vetted picks for each major item (Budget → Premium)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {dashboardData.matchmaker.map((section, sidx) => (
                  <div key={sidx} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {section.category}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>

                    <Card
                      className="border-2 border-green-600 shadow-lg cursor-pointer transition-all"
                      onClick={() =>
                        setShowMatchmakerDetails(
                          showMatchmakerDetails === section.category
                            ? null
                            : section.category,
                        )
                      }
                    >
                      <Badge className="absolute top-4 right-4 bg-green-600">
                        ⭐ Recommended Pick
                      </Badge>
                      <CardHeader>
                        <div className="space-y-1">
                          <p className="text-sm text-green-700 font-medium">
                            ⭐ Gold Standard
                          </p>
                          <CardTitle className="text-lg">
                            {section.pick.name}
                          </CardTitle>
                          <p className="text-lg font-bold text-green-600">
                            {section.pick.price}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-green-100 rounded p-3">
                          <p className="text-sm font-medium text-green-800">
                            Example: {section.pick.example}
                          </p>
                        </div>
                        {showMatchmakerDetails === section.category && (
                          <div className="pt-3 border-t border-green-200">
                            <p className="text-sm text-foreground">
                              {section.pick.why}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROADMAP TAB */}
          <TabsContent value="roadmap" className="space-y-6">
            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-blue-700 text-2xl">
                    <Calendar className="h-6 w-6" />
                    Monthly Roadmap
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    What to buy each month (avoid wasting money on early
                    purchases)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {dashboardData.monthlyRoadmap.map((month, midx) => (
                  <Card key={midx} className={`border-2 ${month.color}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{month.month}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {month.items.map((item, iidx) => (
                          <div
                            key={iidx}
                            className="flex items-start gap-3 pb-3 last:pb-0 last:border-b-0 border-b border-gray-200"
                          >
                            <Badge
                              className={`mt-1 ${
                                item.priority === "CRITICAL"
                                  ? "bg-red-200 text-red-900"
                                  : item.priority === "HIGH"
                                    ? "bg-orange-200 text-orange-900"
                                    : item.priority === "SOON"
                                      ? "bg-yellow-200 text-yellow-900"
                                      : item.priority === "PLAN"
                                        ? "bg-blue-200 text-blue-900"
                                        : "bg-gray-200 text-gray-900"
                              } whitespace-nowrap text-xs font-semibold`}
                            >
                              {item.priority}
                            </Badge>
                            <p className="text-sm font-medium text-foreground">
                              {item.item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Tips Section */}
                <Card className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">
                      💡 Smart Shopping Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-blue-800">
                    <p>
                      ✓ Don't stock up on sizes early. Baby grows fast. Buy as
                      needed.
                    </p>
                    <p>
                      ✓ "Newborn" size is often a waste. Jump to 0-3m where
                      possible.
                    </p>
                    <p>
                      ✓ Used gear is fine for: swaddles, burp cloths, some baby
                      clothing
                    </p>
                    <p>
                      ✓ New gear needed for: car seat, mattress, bottles, if
                      bottle feeding
                    </p>
                    <p>
                      ✓ Borrow when possible: play mats, floor gym (month 3+)
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-300">
          <CardContent className="pt-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              Need More Help?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Found this helpful? Send us feedback or share your experience with
              other parents.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Feedback
              </Button>
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Share2 className="h-4 w-4" />
                Share with Friends
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
