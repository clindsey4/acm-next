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
    const session = await getActiveSession(cookies())
    if (session == null)
      return redirect("./")
    if (session.user && session.user.email) {
      deleteUser(session.user.email)
    }
    redirect("./")
  }
  
  if (session == null)
    return (
      <h2 className="w-full text-center text-3xl md:text-4xl font-normal md:font-bold mt-5">{langDict.data_deletion_no_session}</h2>
    )
  return (
    <form action={deleteData} className="w-full flex flex-col gap-5 justify-center items-center">
      <h1 className="text-on-surface font-bold text-2xl text-center">{langDict.data_deletion_header}</h1>
      <section className="max-w-lg flex flex-col gap-5 justify-center">
        <FilledButton href="../PrivacyPolicy.pdf" text={langDict.privacy_policy}/>
        <FilledButton text={langDict.delete_data} />
      </section>
    </form>
  )
}