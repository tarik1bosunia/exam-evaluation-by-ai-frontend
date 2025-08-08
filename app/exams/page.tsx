"use client";

import ExamList from "@/components/ExamList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const ExamsPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">All Exams</h1>
                    <p className="text-muted-foreground">
                        Browse and manage all created exams.
                    </p>
                </div>
                <Link href="/?view=create" passHref>
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create New Exam
                    </Button>
                </Link>
            </div>
            <ExamList />
        </div>
    );
};

export default ExamsPage;