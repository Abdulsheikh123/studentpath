"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStates, fetchDistricts } from "@/lib/api-public";

export default function CollegesFilter() {
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  useEffect(() => {
    fetchStates().then((res) => setStates(res.data || []));
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(Number(selectedState)).then((res) =>
        setDistricts(res.data || [])
      );
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  return (
    <Card className="rounded-3xl border border-border/70 bg-background py-0 shadow-sm">
      <CardContent className="grid gap-4 px-6 py-6 sm:px-8 sm:py-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">State</p>
          <Select onValueChange={setSelectedState}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id.toString()}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">City</p>
          <Select onValueChange={setSelectedDistrict} disabled={!selectedState}>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Course</p>
          <Select>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {["BTech", "BCA", "BBA", "BA", "BCom", "BSc", "MBBS", "MBA", "MCA"].map((opt) => (
                <SelectItem key={opt} value={opt.toLowerCase()}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Type</p>
          <Select>
            <SelectTrigger className="rounded-2xl">
              <SelectValue placeholder="Government / Private" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="rounded-2xl md:col-span-2 lg:col-span-3 xl:col-span-4 mt-2">
          <Search className="mr-2 h-4 w-4" />
          Search Colleges
        </Button>
      </CardContent>
    </Card>
  );
}
