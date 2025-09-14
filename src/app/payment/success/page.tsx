import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you for your submission.</p>
          <p>Your report is being processed and will be added shortly.</p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Submit another report
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
