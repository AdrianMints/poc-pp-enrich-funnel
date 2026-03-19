/* Defines lightweight tutorial copy shown as a dismissible popup per screen. */
const TutorialContent = {
  'index.html': {
    title: 'Selecciona una prenda',
    body: 'Elige directamente una prenda de la lista de pendientes del sistema, o usa el buscador para encontrarla por SKU o nombre. Una vez seleccionada, el botón inferior se activa para continuar.'
  },
  'preview.html': {
    title: 'Preview de datos base',
    body: 'Aquí se muestran datos simulados traídos desde Presta Prenda. Esta vista es solo de referencia y se mantiene en modo lectura.'
  },
  'photos.html': {
    title: 'Captura guiada',
    body: 'Puedes tomar hasta 4 fotos siguiendo la referencia visual o saltar este paso con el botón inferior para seguir navegando la demo.'
  },
  'details.html': {
    title: 'Datos del valuador',
    body: 'Estos controles solo ilustran el formulario futuro. Puedes tocar uno, varios o ningún campo y continuar sin validación.'
  },
  'loading.html': {
    title: 'Generación simulada',
    body: 'Esta pantalla simula el procesamiento con IA. Avanza sola en 3 segundos, pero también puedes usar Continuar ahora para saltarla.'
  },
  'review.html': {
    title: 'Revisión editable',
    body: 'Aquí eliges una variante visual y puedes editar título o descripción. Si no modificas nada, igual puedes publicar y cerrar el flujo.'
  },
  'success.html': {
    title: 'Publicación final',
    body: 'La prenda ya quedó publicada en esta demo. Puedes reiniciar el funnel o volver al preview para revisar la ficha generada.'
  }
};

/* Returns the current page filename used to map tutorial content. */
function getTutorialPageName() {
  var path = window.location.pathname.split('/');
  return path[path.length - 1] || 'index.html';
}

/* Builds a per-screen dismissal key so the popup only appears once per session. */
function getTutorialDismissKey(pageName) {
  return 'pp.tutorialDismissed.' + pageName;
}

/* Hides the popup and persists dismissal for the current screen. */
function dismissTutorial(popover, pageName) {
  sessionStorage.setItem(getTutorialDismissKey(pageName), '1');
  popover.classList.add('is-closing');
  window.setTimeout(function () {
    popover.hidden = true;
    popover.remove();
  }, 170);
}

/* Injects a dismissible tutorial popup for the active screen when needed. */
function initTutorialPopover() {
  var pageName = getTutorialPageName();
  var content = TutorialContent[pageName];
  if (!content) {
    return;
  }
  if (sessionStorage.getItem(getTutorialDismissKey(pageName)) === '1') {
    return;
  }

  var popover = document.createElement('aside');
  popover.className = 'tutorial-popover';
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-live', 'polite');
  popover.setAttribute('aria-label', content.title);
  popover.innerHTML =
    '<div class="tutorial-popover-header">' +
      '<div>' +
        '<div class="tutorial-popover-title">' + content.title + '</div>' +
        '<div class="tutorial-popover-body">' + content.body + '</div>' +
      '</div>' +
      '<button type="button" class="tutorial-popover-close" aria-label="Cerrar tutorial">&times;</button>' +
    '</div>' +
    '<div class="tutorial-popover-actions">' +
      '<button type="button" class="tutorial-popover-dismiss">Entendido</button>' +
    '</div>';

  document.body.appendChild(popover);

  popover.querySelector('.tutorial-popover-close').addEventListener('click', function () {
    dismissTutorial(popover, pageName);
  });

  popover.querySelector('.tutorial-popover-dismiss').addEventListener('click', function () {
    dismissTutorial(popover, pageName);
  });
}

document.addEventListener('DOMContentLoaded', initTutorialPopover);