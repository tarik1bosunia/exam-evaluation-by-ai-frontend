# Guide: Displaying the Exam List

This guide will walk you through the process of fetching and displaying a list of created exams in your Next.js application, with a Django Rest Framework (DRF) backend.

## 1. Backend: Django View and URL

First, let's create the backend endpoint to serve the list of exams.

### `views.py`

You'll need to add a `ListAPIView` to your `views.py` to handle listing all exams.

```python
from rest_framework import generics
from .models import Exam
from .serializers import ExamSerializer

# Existing ExamCreateView
class ExamCreateView(generics.CreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

# New ExamListView
class ExamListView(generics.ListAPIView):
    queryset = Exam.objects.all().order_by('-created_at') # Show newest first
    serializer_class = ExamSerializer
```

### `urls.py`

Now, add the URL for the new list view.

```python
from django.urls import path
from .views import ExamCreateView, ExamListView

urlpatterns = [
    path('exams/create/', ExamCreateView.as_view(), name='exam-create'),
    path('exams/', ExamListView.as_view(), name='exam-list'), # New URL
]
## 2. Frontend: RTK Query API Slice

Now, let's update the RTK Query endpoint to fetch the list of exams.

### `lib/redux/api/examApi.ts`

Add a `getExams` query to your `examApi` slice.

```typescript
import { apiSlice } from "./apiSlice";

// ... existing interfaces

export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Existing createExam mutation
        createExam: builder.mutation<Exam, ExamData>({
            query: (examData) => ({
                url: '/core/exams/create/',
                method: 'POST',
                body: examData,
            }),
            invalidatesTags: ['Exam'],
        }),
        // New getExams query
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
    }),
});

export const { useCreateExamMutation, useGetExamsQuery } = examApi;
```

Make sure you have `'Exam'` in the `tagTypes` in your main `apiSlice.ts` file. This setup will automatically refetch the list of exams whenever a new exam is created.

## 3. Frontend: Create Exam List Component

This component will fetch the exams using the `useGetExamsQuery` hook and display them.

### `components/ExamList.tsx`

Create a new file for the `ExamList` component.

```typescript
"use client";

import { useGetExamsQuery } from "@/lib/redux/api/examApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, AlertCircle, ArrowRight } from "lucide-react";

const ExamList = () => {
    const { data: exams, error, isLoading } = useGetExamsQuery();

    if (isLoading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex justify-end mt-4">
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load exams. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    if (!exams || exams.length === 0) {
        return (
            <div className="text-center py-16">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No exams found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating a new exam.
                </p>
                {/* Optional: Add a button to create an exam */}
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
                <Card key={exam.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{exam.title}</CardTitle>
                        <CardDescription>{exam.subject}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">{exam.instructions}</p>
                    </CardContent>
                    <div className="p-6 pt-0 flex justify-end">
                         <Button variant="outline" size="sm">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default ExamList;
```

## 4. Frontend: Create Exam List Page

Now, let's create a new page to host the `ExamList` component.

### `app/exams/page.tsx`

Create a new page for displaying the list of exams.

```typescript
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
```

### `app/page.tsx`

We need to adjust the main page to handle navigation to the new exams page. We will remove the `dashboard` view and instead navigate to the `/exams` page.

```typescript
// ... imports

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'create'>('home');

  if (currentView === 'create') {
    // We can redirect to the exams page on completion
    return <ExamCreation onBack={() => setCurrentView('home')} onComplete={() => window.location.href = '/exams'} />;
  }

  // The 'dashboard' view is removed from here.
  // It will be replaced by the new /exams page.

  return (
    // ... existing JSX for the home page
  );
};

export default Index;
```

## 5. Frontend: Update Navigation

Finally, let's add a link to the new exams page in the main navigation.

### `components/Navigation.tsx`

Update the `Navigation` component to include a link to the `/exams` page.

```typescript
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, GraduationCap, BookOpen } from "lucide-react";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ExamAI</h1>
              <Badge variant="secondary" className="text-xs">
                AI Grading Platform
              </Badge>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/exams" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Exams
            </Link>
            <Link href="/#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Benefits
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <GraduationCap className="w-4 h-4 mr-2" />
              Demo
            </Button>
            <Link href="/?view=create" passHref>
                <Button variant="default" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Exam
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
```

## 6. Conclusion

By following this guide, you have successfully implemented a feature to display a list of exams. This includes:

- A backend API endpoint to serve the exam data.
- An RTK Query hook to fetch the data on the frontend.
- A new page and component to display the exams in a clean, user-friendly interface.
- Updated navigation for easy access to the new page.

This provides a solid foundation that you can build upon with features like pagination, search, and more detailed exam view pages.