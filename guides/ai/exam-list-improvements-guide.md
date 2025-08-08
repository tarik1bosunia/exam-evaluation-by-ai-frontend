# Guide: Improving the Exam List Feature

This guide outlines several improvements to enhance the exam list feature, making it more interactive, informative, and scalable.

## 1. Dynamic Exam Detail Page

The most significant improvement is to allow users to click on an exam to see its full details on a separate page.

### 1.1. Backend: Endpoint for a Single Exam

First, we need an API endpoint that can retrieve a single exam by its ID.

#### `views.py`

Add a `RetrieveAPIView` to handle fetching a single exam instance.

```python
from rest_framework import generics
from .models import Exam
from .serializers import ExamSerializer

# ... existing views ...

# New ExamDetailView
class ExamDetailView(generics.RetrieveAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    lookup_field = 'pk' # 'pk' is the default, but it's good to be explicit
```

#### `urls.py`

Add a new URL pattern for the detail view. Make sure it's placed correctly to avoid conflicts with other URL patterns.

```python
from django.urls import path
from .views import ExamCreateView, ExamListView, ExamDetailView

urlpatterns = [
    path('exams/create/', ExamCreateView.as_view(), name='exam-create'),
    path('exams/', ExamListView.as_view(), name='exam-list'),
    path('exams/<int:pk>/', ExamDetailView.as_view(), name='exam-detail'), # New URL
]
### 1.2. Frontend: API Slice for a Single Exam

Next, update the RTK Query slice to include a query for fetching a single exam.

#### `lib/redux/api/examApi.ts`

Add a `getExamById` query to the `examApi`.

```typescript
// ... imports and existing code ...

export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ... existing endpoints ...
        getExams: builder.query<Exam[], void>({
            query: () => '/core/exams/',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Exam' as const, id })),
                        { type: 'Exam', id: 'LIST' },
                    ]
                    : [{ type: 'Exam', id: 'LIST' }],
        }),
        // New getExamById query
        getExamById: builder.query<Exam, number>({
            query: (id) => `/core/exams/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Exam', id }],
        }),
    }),
});

export const { useCreateExamMutation, useGetExamsQuery, useGetExamByIdQuery } = examApi;
```
### 1.3. Frontend: Create the Exam Detail Page

Now, create the dynamic page that will display the details of a selected exam.

#### `app/exams/[id]/page.tsx`

Create a new file at this path. This is a dynamic route in Next.js, where `[id]` will be the ID of the exam.

```typescript
"use client";

import { useParams } from "next/navigation";
import { useGetExamByIdQuery } from "@/lib/redux/api/examApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Book, HelpCircle, Check, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ExamDetailPage = () => {
    const params = useParams();
    const id = Number(params.id);
    const { data: exam, error, isLoading } = useGetExamByIdQuery(id, {
        skip: !id, // Don't run the query if the id is not available yet
    });

    if (isLoading || !id) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-10 w-48 mb-8" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-6 w-32 mb-2" />
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load exam details. It might not exist or an error occurred.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!exam) {
        return <div className="container mx-auto px-4 py-8">Exam not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/exams" passHref>
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to All Exams
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{exam.title}</CardTitle>
                    <CardDescription className="text-lg">{exam.subject}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div>
                        <h3 className="font-semibold text-xl mb-2 flex items-center"><Book className="w-5 h-5 mr-2" /> Instructions</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{exam.instructions}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-xl mb-4 flex items-center"><HelpCircle className="w-5 h-5 mr-2" /> Questions ({exam.questions.length})</h3>
                        <div className="space-y-6">
                            {exam.questions.map((q, index) => (
                                <div key={q.id} className="p-4 border rounded-lg bg-muted/30">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold flex-1">{index + 1}. {q.text}</p>
                                        <span className="text-sm font-bold text-primary ml-4 whitespace-nowrap">{q.mark} Marks</span>
                                    </div>
                                    <div className="mt-3 pl-6 border-l-2 border-primary/50">
                                        <p className="text-sm text-muted-foreground flex items-start">
                                            <Check className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                                            <span className="font-semibold mr-1">Ideal Answer:</span> {q.ideal_answer}
                                        </p>
                                        {q.instructions && (
                                            <p className="text-sm text-muted-foreground mt-2 flex items-start">
                                                <Hash className="w-4 h-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                                                <span className="font-semibold mr-1">Grading Note:</span> {q.instructions}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamDetailPage;
```
## 2. UI/UX Refinements for Exam List

With the detail page in place, we can now improve the main exam list to make it more informative and link to the new page.

### `components/ExamList.tsx` (Refactored)

Update the `ExamList` component to make the cards clickable and display more information.

```typescript
"use client";

import { useGetExamsQuery } from "@/lib/redux/api/examApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertCircle, ArrowRight, HelpCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const ExamList = () => {
    const { data: exams, error, isLoading } = useGetExamsQuery();

    // ... isLoading and error states remain the same ...

    if (!exams || exams.length === 0) {
        // ... empty state remains the same ...
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
                <Link key={exam.id} href={`/exams/${exam.id}`} className="flex">
                    <Card className="flex flex-col w-full hover:border-primary transition-colors duration-200 hover:shadow-lg">
                        <CardHeader>
                            <CardTitle className="line-clamp-2">{exam.title}</CardTitle>
                            <CardDescription>{exam.subject}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <HelpCircle className="w-4 h-4 mr-2" />
                                {exam.questions.length} Questions
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                Created on {format(new Date(exam.created_at), "PPP")}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                             <div className="flex items-center text-sm font-medium text-primary">
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
};

export default ExamList;
```
## 3. Scalability: Implementing Pagination

As the number of exams grows, fetching all of them at once becomes inefficient. Pagination is essential for performance.

### 3.1. Backend: Add Pagination to the List View

DRF has built-in support for pagination, which is easy to configure.

#### `views.py`

Update the `ExamListView` to use a pagination class.

```python
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .models import Exam
from .serializers import ExamSerializer

# Optional: Define a custom pagination class to set the page size
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6 # Number of exams per page
    page_size_query_param = 'page_size'
    max_page_size = 100

# ... existing views ...

class ExamListView(generics.ListAPIView):
    queryset = Exam.objects.all().order_by('-created_at')
    serializer_class = ExamSerializer
    pagination_class = StandardResultsSetPagination # Add this line
```

With this change, the API response for `/core/exams/` will now be an object containing `count`, `next`, `previous`, and `results` fields.

### 3.2. Frontend: Update API Slice and Component

The frontend needs to be updated to handle the new paginated response structure.

#### `lib/redux/api/examApi.ts` (Refactored)

First, define a type for the paginated response and update the `getExams` query.

```typescript
// ... imports ...

// Define the paginated response type
interface PaginatedExams {
    count: number;
    next: string | null;
    previous: string | null;
    results: Exam[];
}

// ... existing interfaces ...

export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ... existing endpoints ...
        // Update getExams to handle pagination
        getExams: builder.query<PaginatedExams, number>({
            query: (page = 1) => `/core/exams/?page=${page}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({ type: 'Exam' as const, id })),
                        { type: 'Exam', id: 'LIST' },
                    ]
                    : [{ type: 'Exam', id: 'LIST' }],
        }),
        // ... existing getExamById ...
    }),
});

export const { useCreateExamMutation, useGetExamsQuery, useGetExamByIdQuery } = examApi;
```

#### `components/ExamList.tsx` (Refactored with Pagination)

Finally, update the `ExamList` component to manage the current page and render pagination controls.

```typescript
"use client";

import { useState } from "react";
import { useGetExamsQuery } from "@/lib/redux/api/examApi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// ... other imports ...

const ExamList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, error, isLoading } = useGetExamsQuery(currentPage);

    const exams = data?.results;
    const totalPages = data ? Math.ceil(data.count / 6) : 0; // Assuming page size is 6

    // ... isLoading, error, and empty states remain similar, but check `exams` instead of `data` ...

    const handlePrevious = () => {
        if (data?.previous) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (data?.next) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* The mapping of `exams` remains the same */}
                {exams && exams.map((exam) => (
                    // ... card JSX ...
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={handlePrevious} disabled={!data?.previous} />
                        </PaginationItem>
                        {/* You can also render page numbers here if desired */}
                        <PaginationItem>
                            <PaginationLink isActive>
                                Page {currentPage} of {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext onClick={handleNext} disabled={!data?.next} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default ExamList;
```