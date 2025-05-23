import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function UniversitiesPage() {
  // Sample data for universities
  const universities = [
    {
      id: 1,
      name: "Addis Ababa University",
      location: "Addis Ababa",
      established: 1950,
      graduates: 124563,
      programs: 87,
    },
    {
      id: 2,
      name: "Bahir Dar University",
      location: "Bahir Dar",
      established: 1963,
      graduates: 87421,
      programs: 65,
    },
    {
      id: 3,
      name: "Jimma University",
      location: "Jimma",
      established: 1983,
      graduates: 56234,
      programs: 52,
    },
    {
      id: 4,
      name: "Hawassa University",
      location: "Hawassa",
      established: 1976,
      graduates: 42156,
      programs: 48,
    },
    {
      id: 5,
      name: "Mekelle University",
      location: "Mekelle",
      established: 1991,
      graduates: 31245,
      programs: 43,
    },
    {
      id: 6,
      name: "Gondar University",
      location: "Gondar",
      established: 1954,
      graduates: 28765,
      programs: 39,
    },
    {
      id: 7,
      name: "Arba Minch University",
      location: "Arba Minch",
      established: 1986,
      graduates: 24532,
      programs: 37,
    },
    {
      id: 8,
      name: "Adama Science and Technology University",
      location: "Adama",
      established: 1993,
      graduates: 21345,
      programs: 32,
    },
  ];

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/moe_dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manage Universities
              </h1>
              <p className="text-muted-foreground">
                Manage and monitor registered universities
              </p>
            </div>
          </div>
          <Button className="bg-[#2F4D8A] hover:bg-[#243c6d] text-white self-start sm:self-center">
            <Plus className="mr-2 h-4 w-4" />
            Add University
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Universities</CardTitle>
            <CardDescription>
              List of all registered universities in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Search universities..." className="pl-8" />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Established</TableHead>
                    <TableHead>Graduates</TableHead>
                    <TableHead>Programs</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {universities.map((university) => (
                    <TableRow key={university.id}>
                      <TableCell className="font-medium">
                        {university.name}
                      </TableCell>
                      <TableCell>{university.location}</TableCell>
                      <TableCell>{university.established}</TableCell>
                      <TableCell>
                        {university.graduates.toLocaleString()}
                      </TableCell>
                      <TableCell>{university.programs}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/moe_dashboard/universities/${university.id}`}
                          >
                            View Details
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
