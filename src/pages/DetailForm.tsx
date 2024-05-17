import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useGlobalContext, { FormBase } from "@/context/useGlobalContext"
import CreateFields from "@/components/forms/CreateFields"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DetailForm() {
  const { forms, setForms } = useGlobalContext()
  const { idForm } = useParams<{ idForm: string }>()
  const [form, setForm] = useState<FormBase>({ id: 0, name: "", fields: [] })

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

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const foundForm = forms.find((form) => form.id === parseInt(idForm!))
        if (foundForm) {
          setForm(foundForm)
        } else {
          console.log(`No se encontró un formulario con el ID ${idForm}`)
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchForm()
  }, [setForm, form, idForm, forms])

  return (
    <div className="h-screen w-full container">
      <h1 className="text-4xl text-center mt-10 font-bold text-black">
        Formulario - {form.name}
      </h1>
      <div className="flex w-full my-8 space-x-2">
        <Link to={`/form/${idForm}`}>
          <Button variant="default">Ver formulario</Button>
        </Link>
        <div className="flex-none">
          <CreateFields />
        </div>
      </div>
      <div className="grid gap-4">
        {form.fields?.map((field) => (
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>{field.name}</CardTitle>
              <CardDescription className="max-w-md text-balance leading-relaxed">
                {field.label}
                <Input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  className="border border-gray-300 rounded-md p-2"
                />
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Editar campo</Button>
            </CardFooter>
          </Card>
          //   <div>
          //     <div className="flex flex-col">
          //       <label htmlFor={field.name} className="text-sm text-gray-600">
          //         {field.label}
          //       </label>

          //     </div>
          //   </div>
          //   <CardForm key={form.id} name={form.name} id={form.id} />
        ))}
      </div>
    </div>
  )
}
