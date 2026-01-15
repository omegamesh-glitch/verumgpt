export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Política de Privacidade</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Coleta de Informações</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              O VERUM Node coleta as seguintes informações:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Mensagens de chat (armazenadas localmente no navegador)</li>
              <li>Preferências de configuração (tema, voz, etc.)</li>
              <li>Dados de uso para melhorar o serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Uso das Informações</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-4">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Personalizar sua experiência</li>
              <li>Garantir a segurança do serviço</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Compartilhamento de Dados</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto quando necessário 
              para fornecer o serviço (ex: OpenAI API para processamento de mensagens).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Segurança</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Implementamos medidas de segurança para proteger suas informações, incluindo criptografia e 
              práticas seguras de desenvolvimento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Seus Direitos</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Acessar seus dados</li>
              <li>Exportar seus dados</li>
              <li>Excluir seus dados</li>
              <li>Revogar consentimento a qualquer momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência. Você pode gerenciar 
              as preferências de cookies nas configurações do navegador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Alterações</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Contato</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Para questões sobre privacidade, entre em contato: 
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
