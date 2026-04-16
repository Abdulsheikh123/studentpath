"use client";

import { useState } from "react";
import HomeHero from "./home/HomeHero";
import HomeExploreCards from "./home/HomeExploreCards";
import HomeQuickSearch from "./home/HomeQuickSearch";
import HomeSearchResults from "./home/HomeSearchResults";
import HomeTestimonials from "./home/HomeTestimonials";
import HomeStats from "./home/HomeStats";
import PageContainer from "./PageContainer";

export default function HomeSection() {
  const [searchValue, setSearchValue] = useState("");
  const [shouldRenderResults, setShouldRenderResults] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    const normalized = value.trim();

    if (!normalized) {
      setIsResultsOpen(false);

      window.setTimeout(() => {
        setShouldRenderResults(false);
      }, 800);
      return;
    }

    setShouldRenderResults(true);
    window.setTimeout(() => {
      setIsResultsOpen(true);
    }, 120);
  };

  return (
    <main className="flex min-h-screen w-full min-w-0 flex-col items-center overflow-x-hidden">
      <HomeHero />
      <section className="w-full pb-7 pt-3 sm:pb-10 sm:pt-5">
        <PageContainer>
          <HomeQuickSearch
            embedded
            value={searchValue}
            onQueryChange={handleSearchChange}
          />
        </PageContainer>
      </section>
      {shouldRenderResults ? (
        <section
          className={`grid overflow-hidden transition-all duration-900 ease-in-out ${
            isResultsOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <HomeSearchResults query={searchValue.trim()} />
          </div>
        </section>
      ) : null}
      <HomeStats />
      <HomeExploreCards />
      <HomeTestimonials />
    </main>
  );
}
