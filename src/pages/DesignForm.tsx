import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import useFormsContext, { FormBase } from "@/context/useFormContext"
import AddSectionForm from "@/components/builderForm/AddSectionForm"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import AddInput from "@/components/builderForm/AddInputForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function DesignForm() {
  const { forms, setForms } = useFormsContext()

  const { idForm } = useParams<{ idForm: string }>()
  const [form, setForm] = useState<FormBase>({ id: 0, title: "", sections: [] })

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const savedForms = JSON.parse(localStorage.getItem("forms-v2")!)
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

  const handleSaveForm = () => {
    try {
      const newForms = forms.map((f) =>
        f.id === form.id ? { ...form, isSaved: true, isPublished: false } : f
      )
      setForms(newForms)
      localStorage.setItem("forms-v2", JSON.stringify(newForms))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handlePublishedForm = () => {
    try {
      const newForms = forms.map((f) =>
        f.id === form.id ? { ...form, isSaved: true, isPublished: true } : f
      )
      setForms(newForms)
      localStorage.setItem("forms-v2", JSON.stringify(newForms))
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="h-full w-full container">
      <h1 className="text-4xl text-center mt-10 font-bold text-black">
        Diseñar Formulario - {form.title}
      </h1>
      <div className="flex w-full my-8 space-x-2">
        <Button onClick={handleSaveForm}>Guardar</Button>
        <Button onClick={handlePublishedForm}>Publicar</Button>
      </div>
      <div className="container">
        {/* <DndContext onDragEnd={handleDragEnd}> */}
        <div className="flex h-full space-x-3">
          {/* <div className="grid gap-4 h-screen bg-blue-300 p-2 rounded-lg">
            <p>Componentes</p>
            <AddInput></AddInput>
          </div> */}

          <div className="flex-grow grid  rounded-lg gap-4 p-2 overflow-y-visible">
            {form.sections?.length === 0 ? (
              <p className="mx-auto text-xl font-semibold">
                {"No hay secciones disponibles en este formulario."}
              </p>
            ) : (
              form.sections?.map((section) => (
                <Accordion
                  key={section.title}
                  className="bg-slate-200 rounded-lg p-4 h-fit shadow-lg"
                  type="single"
                  defaultValue={section.id.toString()}
                  collapsible
                >
                  <AccordionItem
                    defaultValue={section.id.toString()}
                    value={section.id.toString()}
                  >
                    <AccordionTrigger>
                      {section.title} - Sección {section.id}
                    </AccordionTrigger>

                    <AccordionContent>
                      {section.inputs?.map((input) => (
                        <div
                          key={input.name}
                          className="bg-slate-300 p-2 rounded-lg my-2"
                        >
                          {(() => {
                            switch (input.type) {
                              case "radio":
                                return (
                                  <div className="grid w-full gap-2">
                                    <Label htmlFor={input.name}>
                                      {input.label}
                                    </Label>
                                    <Label
                                      className="text-xs text-gray-500"
                                      htmlFor={input.name}
                                    >
                                      {input.placeholder}
                                    </Label>
                                    <RadioGroup>
                                      {input.multipleOptions?.map(
                                        (option, index) => (
                                          <div
                                            key={index}
                                            className="grid gap-2"
                                          >
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem
                                                value={option.value}
                                                id={option.value}
                                              />
                                              <Label htmlFor={option.value}>
                                                {option.label}
                                              </Label>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </RadioGroup>
                                  </div>
                                )
                              case "checkbox":
                                return (
                                  <div className="grid w-full gap-2">
                                    <Label htmlFor={input.name}>
                                      {input.label}
                                    </Label>
                                    <Label
                                      className="text-xs text-gray-500"
                                      htmlFor={input.name}
                                    >
                                      {input.placeholder}
                                    </Label>
                                    <div className="grid gap-2">
                                      {input.multipleOptions?.map(
                                        (option, index) => (
                                          <div
                                            key={index}
                                            className="grid gap-2"
                                          >
                                            <div className="flex items-center space-x-2">
                                              <Checkbox id={option.value} />
                                              <Label htmlFor={option.value}>
                                                {option.label}
                                              </Label>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )
                              case "select":
                                return (
                                  <div className="grid w-full gap-1.5">
                                    <Label htmlFor={input.name}>
                                      {input.label}
                                    </Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue
                                          placeholder={input.placeholder}
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {input.multipleOptions?.map(
                                          (option, index) => (
                                            <SelectItem
                                              key={index}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )
                              case "textarea":
                                return (
                                  <div className="grid w-full gap-2">
                                    <Label htmlFor={input.name}>
                                      {input.label}
                                    </Label>
                                    <Textarea
                                      placeholder={input.placeholder}
                                      id={input.name}
                                    />
                                  </div>
                                )
                              default:
                                return (
                                  <div className="grid w-full items-center gap-2">
                                    <Label htmlFor={input.name}>
                                      {input.label}
                                    </Label>
                                    <Input
                                      placeholder={input.placeholder}
                                      id={input.name}
                                      type={input.type}
                                    />
                                  </div>
                                )
                            }
                          })()}
                        </div>
                      ))}
                      <AddInput idSection={section.id}></AddInput>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            )}
            <div className="mx-auto my-3">
              <AddSectionForm />
            </div>
          </div>
          {/* <div className="flex-shrink-0 bg-blue-300 rounded-lg p-2">
            Propiedades del Input
          </div> */}
        </div>
        {/* </DndContext> */}
      </div>
    </div>
  )
}
