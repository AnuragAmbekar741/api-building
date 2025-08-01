import AuthLayout from '@/components/layouts/AuthLayout.tsx'
import { RegisterForm } from '@/components/forms/register/RegisterForm'

const Register = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}

export default Register
