// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { Flame, Loader2 } from "lucide-react";

// import { createClient } from "@/lib/supabase/browser";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const AdminAuthForm = () => {
//   const router = useRouter();

//   const supabase = createClient();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const checkSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (session) {
//         router.replace("/admin");
//       }
//     };

//     checkSession();
//   }, [router, supabase.auth]);

//   const handleLogin = async (
//     event: React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     setLoading(true);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         throw error;
//       }

//       router.replace("/admin");
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <form
//         onSubmit={handleLogin}
//         className="w-full max-w-sm space-y-5 rounded-2xl border bg-card p-8 shadow-sm"
//       >
//         <div className="mb-2 flex items-center justify-center gap-2">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
//             <Flame className="h-5 w-5 text-primary-foreground" />
//           </div>

//           <span className="text-2xl font-bold uppercase">
//             FastBite Admin
//           </span>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="email">
//             Email
//           </Label>

//           <Input
//             id="email"
//             type="email"
//             placeholder="admin@email.com"
//             value={email}
//             onChange={(event) =>
//               setEmail(event.target.value)
//             }
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="password">
//             Contraseña
//           </Label>

//           <Input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(event) =>
//               setPassword(event.target.value)
//             }
//             required
//             minLength={6}
//           />
//         </div>

//         <Button
//           type="submit"
//           className="w-full"
//           disabled={loading}
//         >
//           {loading && (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           )}

//           Ingresar
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default AdminAuthForm;
