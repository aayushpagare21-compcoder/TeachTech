import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export const LoadingState = () => (
    <div className="space-y-6 animate-pulse">
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          </Card>
        ))}
      </div>
  
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
  
export const ErrorState = ({ error }: { error: Error }) => (
    <Alert variant="destructive" className="my-6">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold">Evaluation Failed</AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        {error.message || "An error occurred while evaluating your question. Please try again or contact support if the problem persists."}
      </AlertDescription>
      <Button 
        variant="outline" 
        className="mt-4 bg-white hover:bg-gray-100"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </Alert>
  );
  