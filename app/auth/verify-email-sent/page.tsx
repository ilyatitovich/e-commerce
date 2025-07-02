export default function VerifyEmailSentPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          Подтвердите почту
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Мы отправили письмо с подтверждением на вашу электронную почту.
          Пожалуйста, перейдите по ссылке, чтобы завершить регистрацию.
        </p>

        <p className="text-gray-500 text-sm">
          Если письмо не пришло — проверьте папку <strong>«Спам»</strong> или{" "}
          <strong>«Промоакции»</strong>.
        </p>

        {/* Опционально: кнопка повторной отправки письма */}
        {/* <button
          onClick={handleResend}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Отправить письмо ещё раз
        </button> */}
      </div>
    </main>
  );
}
