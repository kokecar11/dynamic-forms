import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"

interface CardFormProps {
  id: number
  name?: string
}

export default function CardForm({ id, name }: CardFormProps) {
  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Formulario # {id}</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          {name}
        </CardDescription>
      </CardHeader>
      <CardFooter className="space-x-2">
        <Link to={`/detail-form/${id}`}>
          <Button variant="default">Ver</Button>
        </Link>
        <Button variant="destructive">Eliminar</Button>
      </CardFooter>
    </Card>
  )
}
