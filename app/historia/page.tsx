"use client"
import Link from "next/link"
import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimation } from "@/components/animations/ScrollAnimation"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { MobileMenu } from "@/components/ui/mobile-menu"
import {
  ChevronRight,
  Heart,
  Users,
  Target,
  Trophy,
  Star,
  Calendar,
  MapPin,
  ShoppingBag,
} from "lucide-react"
import { Bebas_Neue } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function HistoriaPage() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.href.split("#")[1]
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center">
            <div className="flex justify-start">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-10 w-10 md:h-12 md:w-12">
                  <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl text-primary dark:text-white">PASSA BOLA</span>
              </Link>
            </div>
            <div className="hidden md:flex justify-center">
              <Badge className="bg-[#8e44ad] text-white">NOSSA HISTÓRIA</Badge>
            </div>
            <div className="flex justify-end items-center gap-2">
              <Link
                onClick={handleSmoothScroll}
                href="/#loja"
                className="hidden md:flex items-center gap-1 text-primary dark:text-primary-foreground hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm font-medium">Loja</span>
              </Link>
              <ThemeToggleButton />
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#8e44ad] to-[#9b59b6] text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">NOSSA HISTÓRIA</Badge>
              <h1 className={`${bebasNeue.className} text-4xl md:text-6xl font-bold mb-6 tracking-wider`}>
                A JORNADA QUE NOS TROUXE ATÉ AQUI
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Conheça a história por trás da Copa Passa Bola, um movimento que nasceu do sonho de transformar o 
                futebol feminino brasileiro e quebrar barreiras no esporte.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[#c2ff28]" />
                  <span>Paixão pelo Esporte</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#c2ff28]" />
                  <span>Empoderamento Feminino</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#c2ff28]" />
                  <span>Transformação Social</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Início da Jornada */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollAnimation>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8e44ad]/20 to-[#c2ff28]/20 rounded-lg transform rotate-6"></div>
                  <div className="relative bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8e44ad] to-[#9b59b6] rounded-full flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#8e44ad] dark:text-primary">2020</h3>
                        <p className="text-gray-600 dark:text-gray-400">O Início de Tudo</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Em plena pandemia, um grupo de mulheres apaixonadas por futebol se reuniu virtualmente 
                      com um sonho: criar um espaço onde as mulheres pudessem jogar, competir e ser reconhecidas 
                      pelo seu talento, independentemente da idade ou nível técnico.
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={0.2}>
                <div>
                  <Badge className="bg-[#8e44ad] text-white mb-4">O COMEÇO</Badge>
                  <h2 className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}>
                    NASCEU UM SONHO
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    A Copa Passa Bola nasceu da necessidade de criar um movimento que fosse além do futebol. 
                    Queríamos quebrar estereótipos, dar visibilidade ao talento feminino e mostrar que o esporte 
                    pode ser uma ferramenta poderosa de transformação social.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-[#8e44ad]/10 to-[#c2ff28]/10 rounded-lg">
                      <div className="text-2xl font-bold text-[#8e44ad]">2</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fundadoras</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-[#8e44ad]/10 to-[#c2ff28]/10 rounded-lg">
                      <div className="text-2xl font-bold text-[#8e44ad]">1</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Grande Sonho</div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-gradient-to-b from-white to-transparent dark:from-slate-900 dark:to-transparent aurora">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-pink-500 text-white mb-4 hover:bg-pink-600">LINHA DO TEMPO</Badge>
              <h2 className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}>
                MARCOS DA NOSSA JORNADA
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Cada ano trouxe novos desafios, conquistas e momentos inesquecíveis que moldaram quem somos hoje.
              </p>
            </ScrollAnimation>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#8e44ad] to-[#c2ff28]"></div>
                
                {/* Timeline items */}
                <div className="space-y-12">
                  {[
                    {
                      year: "2021",
                      title: "Primeira Copa",
                      description: "Realizamos nossa primeira Copa Passa Bola com 8 times e mais de 100 atletas participantes.",
                      icon: Trophy,
                      side: "left"
                    },
                    {
                      year: "2022",
                      title: "Expansão Nacional",
                      description: "A Copa cresceu e passou a receber times de diferentes estados, tornando-se um evento nacional.",
                      icon: MapPin,
                      side: "right"
                    },
                    {
                      year: "2023",
                      title: "Reconhecimento",
                      description: "Fomos reconhecidas como uma das principais iniciativas de fomento ao futebol feminino do país.",
                      icon: Star,
                      side: "left"
                    },
                    {
                      year: "2024",
                      title: "32 Times",
                      description: "Alcançamos a marca de 32 times participantes, com mais de 500 atletas em campo.",
                      icon: Users,
                      side: "right"
                    }
                  ].map((item, index) => (
                    <ScrollAnimation key={index} delay={index * 0.2}>
                      <div className={`flex items-center ${item.side === 'right' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-1/2 ${item.side === 'right' ? 'pl-8' : 'pr-8'}`}>
                          <Card className="dark:bg-slate-800">
                            <CardHeader>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#8e44ad] to-[#9b59b6] rounded-full flex items-center justify-center">
                                  <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-[#8e44ad] dark:text-primary">{item.year}</CardTitle>
                                  <h3 className="text-lg font-bold">{item.title}</h3>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Timeline dot */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#c2ff28] rounded-full border-4 border-white dark:border-slate-900"></div>
                        
                        <div className="w-1/2"></div>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">NOSSOS VALORES</Badge>
              <h2 className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}>
                O QUE NOS MOVE
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Nossos valores são a base de tudo o que fazemos e acreditamos no poder transformador do esporte.
              </p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Inclusão",
                  description: "Acreditamos que o futebol é para todas, independentemente de idade, nível técnico ou origem.",
                  icon: Heart,
                  color: "from-pink-500 to-pink-600"
                },
                {
                  title: "Empoderamento",
                  description: "Fortalecemos mulheres através do esporte, criando lideranças e rompendo barreiras.",
                  icon: Users,
                  color: "from-[#8e44ad] to-[#9b59b6]"
                },
                {
                  title: "Excelência",
                  description: "Buscamos sempre a melhor experiência possível para nossas atletas e parceiros.",
                  icon: Star,
                  color: "from-[#c2ff28] to-[#a8e526]"
                }
              ].map((value, index) => (
                <ScrollAnimation key={index} delay={index * 0.2}>
                  <Card className="h-full dark:bg-slate-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <value.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-[#8e44ad] dark:text-primary">{value.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Impacto */}
        <section className="py-20 bg-gradient-to-b from-[#8e44ad] to-[#9b59b6] text-white">
          <div className="container mx-auto px-4">
            <ScrollAnimation className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="bg-[#c2ff28] text-[#8e44ad] mb-4 hover:bg-[#c2ff28]">NOSSO IMPACTO</Badge>
              <h2 className={`${bebasNeue.className} text-3xl md:text-5xl font-bold mb-6 tracking-wider`}>
                NÚMEROS QUE TRANSFORMAM
              </h2>
              <p className="text-white/90">
                Cada número representa uma vida tocada, um sonho realizado, uma barreira quebrada.
              </p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Atletas Impactadas" },
                { number: "32", label: "Times Participantes" },
                { number: "4", label: "Anos de História" },
                { number: "15", label: "Estados Representados" }
              ].map((stat, index) => (
                <ScrollAnimation key={index} delay={index * 0.1}>
                  <div className="text-center">
                    <div className={`${bebasNeue.className} text-4xl md:text-5xl font-bold mb-2 text-[#c2ff28]`}>
                      {stat.number}
                    </div>
                    <div className="text-white/80">{stat.label}</div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 bg-accent dark:bg-slate-800">
          <div className="container mx-auto px-4 text-center">
            <ScrollAnimation>
              <h2 className={`${bebasNeue.className} text-3xl md:text-5xl font-bold text-[#8e44ad] dark:text-primary mb-6 tracking-wider`}>
                FAÇA PARTE DESSA HISTÓRIA
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Nossa jornada continua e você pode fazer parte dela. Junte-se a nós e ajude a escrever os próximos capítulos
                dessa história de transformação e empoderamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-[#8e44ad] hover:bg-[#9b59b6] text-white">
                  <Link href="/cadastro">
                    INSCREVA SEU TIME
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-[#8e44ad] text-[#8e44ad] hover:bg-[#8e44ad] hover:text-white">
                  <Link href="/doacao">
                    APOIE NOSSA CAUSA
                  </Link>
                </Button>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-slate-900 text-primary-foreground dark:text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative h-10 w-10">
                  <Image src="/logo.png" alt="Passa Bola Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl">PASSA BOLA</span>
              </div>
              <p className="text-primary-foreground/80 dark:text-gray-300 mb-4">
                Quebrando barreiras no campo e na vida através do futebol feminino.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/historia" className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors">
                    Nossa História
                  </Link>
                </li>
                <li>
                  <Link href="/cadastro" className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors">
                    Cadastro
                  </Link>
                </li>
                <li>
                  <Link href="/loja" className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors">
                    Loja
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contato" className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/doacao" className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors">
                    Doações
                  </Link>
                </li>
                <li>
                  <Link href="/voluntaria" className="text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors">
                    Seja Voluntária
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Conecte-se</h3>
              <p className="text-primary-foreground/80 dark:text-gray-300 mb-4">
                Siga-nos nas redes sociais e fique por dentro de todas as novidades.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/80 dark:text-gray-300 text-sm">
              &copy; 2025 Copa Passa Bola. Todos os direitos reservados.
            </p>
            <p className="text-primary-foreground/80 dark:text-gray-300 text-sm mt-4 md:mt-0">
              Feito com 💜 por mulheres, para mulheres.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}