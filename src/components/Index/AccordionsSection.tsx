import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function AccordionsSection() {
    return(
        <div className="absolute right-10 bottom-10 w-60 text-background bg-foreground">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Regulamin zwrotów</AccordionTrigger>
                    <AccordionContent>
                        Strona nie wykorzystuje plików cookies.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Polityka cookies</AccordionTrigger>
                    <AccordionContent>
                        Strona nie wykorzystuje plików cookies.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default AccordionsSection;