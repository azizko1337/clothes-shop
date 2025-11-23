import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function AccordionsSection() {
  return (
    <div className="w-full border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">Informacje</h3>
          <p className="text-zinc-500 text-sm max-w-xs">
            Wszystko co musisz wiedzieć o naszych zasadach i polityce prywatności.
          </p>
        </div>

        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="returns" className="border-zinc-800">
              <AccordionTrigger className="text-zinc-300 hover:text-white hover:no-underline py-4 text-sm uppercase tracking-wider font-mono">
                Regulamin zwrotów
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed">
                Akceptujemy zwroty w ciągu 14 dni od daty otrzymania zamówienia. 
                Produkty muszą być w stanie nienaruszonym, z oryginalnymi metkami. 
                Koszt przesyłki zwrotnej pokrywa kupujący.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cookies" className="border-zinc-800">
              <AccordionTrigger className="text-zinc-300 hover:text-white hover:no-underline py-4 text-sm uppercase tracking-wider font-mono">
                Polityka cookies
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 leading-relaxed">
                Ta strona używa plików cookies w celu poprawy jakości usług. 
                Korzystając ze strony wyrażasz zgodę na ich używanie.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </div>
    </div>
  )
}

export default AccordionsSection;