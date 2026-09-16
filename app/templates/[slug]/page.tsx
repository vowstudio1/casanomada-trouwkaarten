import { redirect } from "next/navigation";

export default function TemplateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect("/editor/" + params.slug);
}
