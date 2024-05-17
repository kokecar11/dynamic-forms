import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useGlobalContext, { FormBase } from "@/context/useGlobalContext"
import { Button } from "@/components/ui/button"

// const typeToZod = {
//   string: z.string,
//   number: z.number,
//   date: z.date,
//   boolean: z.boolean,
//   // Agrega aquí otros tipos de campo si los necesitas
// }

// // Función para crear el esquema de formulario
// function createFormSchema(formJson: FormBase) {
//   if (!formJson.fields) {
//     throw new Error("El formulario no tiene campos")
//   }
//   return z.object(
//     formJson.fields.reduce((acc, field) => {
//       console.log("field", field.type)
//       if (!field.type || !(field.type in typeToZod)) {
//         throw new Error(`Tipo de campo no soportado: ${field.type}`)
//       }
//       const zodFunc = typeToZod[field.type]
//       if (!zodFunc) {
//         throw new Error(`Tipo de campo no soportado: ${field.type}`)
//       }
//       acc[field.name] = field.required
//         ? zodFunc().nonempty("Este campo es requerido")
//         : zodFunc()
//       return acc
//     }, {})
//   )
// }

export function SendForm() {
  const { forms } = useGlobalContext()
  const { idForm } = useParams<{ idForm: string }>()
  const [form, setForm] = useState<FormBase>({ id: 0, name: "", fields: [] })
  // const formSchema = createFormSchema(form)

  // const formSend = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: "",
  //     label: "",
  //     placeholder: "",
  //     type: "text",
  //     dataField: {
  //       value: "",
  //       defaultValue: "",
  //     },
  //     required: false,
  //   },
  // })

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

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   window.alert("Campo creado exitosamente!")
  // }

  return (
    <div className="h-screen w-full container">
      <h1 className="text-4xl text-center mt-10 font-bold text-black">
        {form.name}
      </h1>
      <div className="grid gap-4">
        <form>
          {form.fields?.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label htmlFor={field.name} className="text-lg font-bold">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                placeholder={field.placeholder}
                className="border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}
          <Button variant={"default"} type="submit">
            Enviar
          </Button>
        </form>
      </div>
    </div>
  )
}
