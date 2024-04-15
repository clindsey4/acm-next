import { FilledButton } from "@/components/material/filled-button"
import { deleteUser } from "@/data/webData"
import { getActiveSession } from "@/lib/oauth"
import { getDictionary, Locale } from "@/localization"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DataDeletion(
  {
    params
  }: {
    params: {
      lang: Locale
    }
  }
) {
  const locale = params.lang
  const langDict = await getDictionary(locale)
  const session = await getActiveSession(cookies())

  async function deleteData(formData: FormData) {
    'use server'
    if (session == null)
      return redirect("./")
    if (session.user != null && session.user.email != null) {
      deleteUser(session.user.email)
    }
    redirect("./")
  }
  
  if (session == null)
    return (
      <p>Must be signed in to delete user data.</p>
    )
  return (
    <form action={deleteData} className="w-full flex flex-col gap-5 justify-center items-center">
      <h1 className="text-on-surface font-bold text-2xl text-center">Deleting your data will erase your user data and current session.</h1>
      <section className="max-w-lg flex flex-col gap-5 justify-center">
        <FilledButton href="../PrivacyPolicy.pdf" text="Privacy and Data Deletion Policy"/>
        <FilledButton text="Delete Data" />
      </section>
    </form>
  )
}