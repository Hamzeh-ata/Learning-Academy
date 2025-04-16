import { t } from 'i18next';
import Swal from 'sweetalert2';

class AlertService {
  showAlert({ type, title, body, confirmButtonText = t('ok') }) {
    Swal.fire({
      title,
      icon: type,
      confirmButtonText,
      allowEscapeKey: true,
      html: body
    });
  }

  showConfirmation({ title, body, callback, cancelCallback }) {
    Swal.fire({
      title: title,
      text: body,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      } else {
        cancelCallback && cancelCallback();
      }
    });
  }

  /**
   *
   * @param type 'success' | 'error' | 'warning' | 'info' | 'question'
   */
  showToast({ type, title, position = 'top-end' }) {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      showCloseButton: true,

      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: type,
      title
    });
  }
}

export default new AlertService();
