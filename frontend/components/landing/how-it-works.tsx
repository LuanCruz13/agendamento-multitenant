const steps = [
    {
        number: "01",
        title: "Crie sua organização",
        description:
            "Cadastre o nome do seu negócio e escolha o endereço do seu link público."
    },
    {
        number: "02",
        title: "Defina seus horários",
        description:
            "Informe em quais dias da semana e em quais faixas de horário você atende."
    },
    {
        number: "03",
        title: "Compartilhe o link",
        description:
          "Seus clientes escolhem um horário livre e recebem a confirmação por e-mail.",
      },
];


export function HowItWorks(){
    return (
        <section
            id="como-funciona"
            className="scroll-mt-20 border-y border-border bg-card"    
        >
            <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
                <div className="max-w-2xl">
                    <h2 className="font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">Três passos entre você e uma agenda cheia</h2>
                    <p className="mt-3 text-muted-foreground">Sem planilha, sem ida e volta no chat para achar um horário.</p>
                </div>
            

            <ol className=" mt-12 grid gap-8 md:grid-cols-3">
                {steps.map((step) => (
                    <li
                        key={step.number}
                        className="flex flex-col gap-3 border-t-2 border-primary pt-6"
                    >
                        <span className="font-serif text-4xl font-semibold text-accent">
                            {step.number}
                        </span>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <p className="leading-relaxed text-muted-foreground">
                            {step.description}
                        </p>
                    </li>
                ))}
            </ol>

        </div>
        </section>
    )
}