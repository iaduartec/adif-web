import { Button } from "../../../components/ui/button";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-intro">
          <h1 className="login-title" id="login-title">
            Prepara ADIF Telecomunicaciones
          </h1>
          <p className="login-copy">
            Una forma clara de organizar tu preparación, practicar y mantener el ritmo de estudio.
          </p>
          <p className="login-disclaimer">
            Esta plataforma <span>no pertenece a ADIF</span>.
          </p>
        </div>
        <div className="login-access">
          <Button>Continuar con Google</Button>
        </div>
      </section>
    </main>
  );
}
