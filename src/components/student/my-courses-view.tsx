"use client";

import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { BrowseSections } from "@/components/student/browse-sections";
import { ExamSchedule } from "@/components/student/exam-schedule";
import { RegisteredCourses } from "@/components/student/registered-courses";
import { ResultsList } from "@/components/student/results-list";
import { TranscriptView } from "@/components/student/transcript-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlParams } from "@/hooks/use-url-params";

const TABS = [
  { value: "registered", label: "My Registrations" },
  { value: "browse", label: "Browse & Register" },
  { value: "exams", label: "Exams" },
  { value: "results", label: "Results" },
  { value: "transcript", label: "Transcript" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function MyCoursesView() {
  const searchParams = useSearchParams();
  const { setParams } = useUrlParams();

  // URL এ যা-ই লেখা থাক, শুধু আমাদের তালিকার মান গ্রহণ করি
  const requested = searchParams.get("tab");
  const tab: TabValue =
    TABS.find((item) => item.value === requested)?.value ?? "registered";

  const handleTabChange = (next: string) => {
    // tab বদলালে আগের tab এর search/filter/page মুছে যায়
    setParams({
      tab: next === "registered" ? null : next,
      search: null,
      semester: null,
      status: null,
    });
  };

  return (
    <>
      <DashboardHeader
        title="My Courses"
        description="Register for courses, track your exams and results, and review your transcript."
      />

      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="overflow-x-auto">
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="registered" className="mt-4">
          <RegisteredCourses />
        </TabsContent>
        <TabsContent value="browse" className="mt-4">
          <BrowseSections />
        </TabsContent>
        <TabsContent value="exams" className="mt-4">
          <ExamSchedule />
        </TabsContent>
        <TabsContent value="results" className="mt-4">
          <ResultsList />
        </TabsContent>
        <TabsContent value="transcript" className="mt-4">
          <TranscriptView />
        </TabsContent>
      </Tabs>
    </>
  );
}
