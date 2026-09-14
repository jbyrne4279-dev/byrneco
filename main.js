document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var successBox = document.getElementById('form-success');
      var errorBox = document.getElementById('form-error');
      successBox.style.display = 'none';
      errorBox.style.display = 'none';

      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (field.type === 'checkbox') {
          if (!field.checked) valid = false;
        } else if (!field.value.trim()) {
          valid = false;
        }
      });

      var emailField = document.getElementById('email');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField && !emailPattern.test(emailField.value.trim())) {
        valid = false;
      }

      if (!valid) {
        errorBox.textContent = 'Please fill in all required fields correctly before submitting.';
        errorBox.style.display = 'block';
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Store submission locally (no backend configured yet).
      try {
        var submissions = JSON.parse(localStorage.getItem('byrneco_enquiries') || '[]');
        var data = {};
        new FormData(form).forEach(function (value, key) {
          data[key] = value;
        });
        data.submittedAt = new Date().toISOString();
        submissions.push(data);
        localStorage.setItem('byrneco_enquiries', JSON.stringify(submissions));
      } catch (err) {
        // localStorage unavailable — ignore, submission still "succeeds" visually
      }

      successBox.textContent = 'Thank you — your enquiry has been received. A member of the Byrne & Co team will contact you within one working day.';
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
    });
  }

  // Highlight current nav link
  var links = document.querySelectorAll('nav.main-nav a');
  var path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (link) {
    if (link.getAttribute('href') === path) {
      link.style.color = '#2f9e6e';
    }
  });

  // Pre-select survey level from a ?survey= query param (e.g. links from the homepage level cards)
  var surveySelect = document.getElementById('survey-level');
  if (surveySelect) {
    var survey = new URLSearchParams(window.location.search).get('survey');
    var hasMatch = Array.prototype.some.call(surveySelect.options, function (opt) {
      return opt.value === survey;
    });
    if (survey && hasMatch) {
      surveySelect.value = survey;
    }
  }
});
