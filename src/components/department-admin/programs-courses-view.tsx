"use client";

import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DepartmentScope } from "@/components/department-admin/department-scope";
import { ProgramsPanel } from "@/components/department-admin/programs-panel";
import { CoursesView } from "@/components/super-admin/courses-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlParams } from "@/hooks/use-url-params";

const TABS = [
  { value: "courses", label: "Courses" },
  { value: "programs", label: "Programs" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function ProgramsCoursesView() {
  const searchParams = useSearchParams();
  const { setParams } = useUrlParams();

  const requested = searchParams.get("tab");
  const tab: TabValue =
    TABS.find((item) => item.value === requested)?.value ?? "courses";

  // tab বদলালে আগের tab এর search/filter/page মুছে যায়
  const handleTabChange = (next: string) =>
    setParams({
      tab: next === "courses" ? null : next,
      search: null,
      programId: null,
      sort: null,
    });

  return (
    <DepartmentScope>
      {(department) => (
        <>
          <DashboardHeader
            title="Programs & Courses"
            description={`Department of ${department.name} (${department.code})`}
          />

          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList>
              {TABS.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="courses" className="mt-4">
              <CoursesView departmentId={department.id} embedded />
            </TabsContent>
            <TabsContent value="programs" className="mt-4">
              <ProgramsPanel department={department} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DepartmentScope>
  );
}
