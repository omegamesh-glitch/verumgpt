export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Termos de Uso</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Ao acessar e usar o VERUM Node, você concorda em cumprir e estar vinculado a estes Termos de Uso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Uso do Serviço</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              O VERUM Node é fornecido "como está" para uso pessoal e comercial. Você concorda em:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Usar o serviço apenas para fins legais</li>
              <li>Não tentar acessar áreas não autorizadas do sistema</li>
              <li>Não usar o serviço para atividades maliciosas</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Propriedade Intelectual</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Todo o conteúdo do VERUM Node, incluindo código, design, textos e funcionalidades, é propriedade de 
              Rafael Augusto Xavier Fernandes e está protegido por direitos autorais e outras leis de propriedade intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 dark:text-gray-300">
              O VERUM Node não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais 
              resultantes do uso ou incapacidade de usar o serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Modificações</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Reservamos o direito de modificar estes termos a qualquer momento. Alterações entrarão em vigor 
              imediatamente após a publicação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Contato</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Para questões sobre estes termos, entre em contato: 
              <a href="mailto:rafael@verumnodelegacy.com.br" className="text-[#10a37f] hover:underline ml-1">
                rafael@verumnodelegacy.com.br
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
