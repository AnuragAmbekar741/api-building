import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Mail,
  Moon,
  Shield,
  Sun,
  Tag,
  Zap,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { useTheme } from '../providers/ThemeProvider'
import { useRouter } from '@tanstack/react-router'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function LandingPage() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        className="relative z-50 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            {/* Updated logo with Bitcount font */}
            <span className="text-2xl font-bitcount font-medium tracking-tight">
              LABEL
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.navigate({ to: '/login' })}
              className="text-md font-medium"
            >
              Login
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <motion.div
          className="mx-auto max-w-4xl"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Zap className="mr-2 h-4 w-4" />
              {/* Using Bitcount for tagline */}
              <span className="font-bitcount">Email on Steroids</span>
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-5xl font-extralight tracking-tight sm:text-7xl lg:text-8xl"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Revolutionize Your Inbox
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground font-light leading-relaxed"
          >
            Transform chaos into clarity. Label, organize, and supercharge your
            email workflow with intelligent tagging and AI-powered organization.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-medium"
            >
              <span className="font-bitcount">Start Organizing</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-light"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Cards Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-10"
              animate={{
                y: [0, -100, 0],
                x: [0, 50, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
            >
              <Mail className="h-8 w-8 text-primary" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12">
        <motion.div
          className="mx-auto max-w-7xl"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Tag,
                title: 'Smart Labeling',
                description:
                  'AI-powered automatic tagging that learns your preferences and organizes emails intelligently.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description:
                  'Process thousands of emails in seconds with our optimized algorithms and intuitive interface.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description:
                  'End-to-end encryption ensures your emails remain private while being perfectly organized.',
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-6"
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    {/* Using Bitcount for feature titles */}
                    <h3 className="text-xl font-bitcount font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}

      {/* CTA Section */}
      <section className="px-6 py-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-12">
              <h2 className="text-4xl font-light tracking-tight mb-4">
                Ready to transform your inbox?
              </h2>
              <p className="text-xl text-muted-foreground font-light mb-8 max-w-2xl mx-auto">
                Join thousands of users who have revolutionized their email
                experience
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-medium"
                >
                  <span className="font-bitcount">Get Started Free</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  No credit card required
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center text-muted-foreground font-light">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Mail className="h-5 w-5" />
            <span className="text-lg font-bitcount font-medium">LABEL</span>
          </div>
          <p>© 2024 LABEL. Email on steroids.</p>
        </div>
      </footer>
    </div>
  )
}
