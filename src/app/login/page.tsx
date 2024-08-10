import { redirect } from "next/navigation";
import { loginAction, validateRequest } from "@/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormComponent } from "../_components/FormComponent";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function Page(): Promise<JSX.Element> {
  const { user } = await validateRequest();
  if (user) return redirect("/");
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormComponent action={loginAction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email bhenkaloda</Label>
                <Input
                  name="email"
                  id="email"
                  placeholder="email@example.com"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </FormComponent>
        </CardContent>
      </Card>
    </div>
  );
}
