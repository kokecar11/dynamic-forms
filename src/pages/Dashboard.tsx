import { useEffect } from "react"
import useGlobalContext from "@/context/useGlobalContext"
import CreateForm from "@/components/forms/CreateForm"
import CardForm from "@/components/forms/CardForm"

export function Dashboard() {
  const { forms, setForms } = useGlobalContext()
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const savedForms = JSON.parse(localStorage.getItem("forms")!)
        if (savedForms) {
          setForms(savedForms)
        } else {
          setForms([])
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchForms()
  }, [setForms])

  return (
    <div className="h-screen w-full container">
      <h1 className="text-4xl text-center mt-10 font-bold text-black">
        Mis Formularios
      </h1>
      <div className="flex w-full my-8 space-x-2">
        <div className="flex-none">
          <CreateForm />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {forms.map((form) => (
          <CardForm key={form.id} name={form.name} id={form.id} />
        ))}
      </div>
    </div>
  )
}
