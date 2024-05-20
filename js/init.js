document.addEventListener('DOMContentLoaded', async() => {  
  const servicesContainerEl = document.querySelector('#portfolio-container');
  const bodyEl = document.querySelector('body');
  const navbarEl = document.querySelector('#navbarResponsive > ul');
  const { data } = await getData();
  data.forEach(service => {
    const navItem = createNavItem(service);
    navbarEl.appendChild(navItem);
    const cardEl = createServicesCard(service);
    servicesContainerEl.appendChild(cardEl);
    const modalEl = createServicesModal(service);
    bodyEl.appendChild(modalEl);
  })
  $('html,body').animate({
    scrollTop: 0,
  }, 700)
});

const getData = () => {
  const GOOGLE_API = 'https://script.google.com/macros/s/AKfycbz0oB5jD0sfG6MA-M0NToIA2HjecdfAMVUwgnkkELhgZLv2ZDHlPxPAYTOk7q0_bD9vDA/exec'

  return new Promise((resolve, reject) => {
    fetch(GOOGLE_API)
      .then((response) => {
        if (!response.ok) {
          reject({ status: response.status });
        }
        resolve(response.json());
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createElement = (tag, options={}) => {
  const el = document.createElement(tag);
  if (options.id) {
    el.id = options.id;
  }
  if (options.classNames && options.classNames.length) {
    el.classList.add(...options.classNames);
  }
  if (options.href) {
    el.href = options.href;
  }
  if (options.src) {
    el.src = options.src;
  }
  if (options.dataset) {
    Object.keys(options.dataset).forEach((key) => {
      el.dataset[key] = options.dataset[key];
    })
  }
  if (options.message) {
    el.innerHTML = options.message;
  }
  if (options.attributes && options.attributes.length) {
    options.attributes.forEach((attribute) => {
      el.setAttribute(attribute.name, attribute.value)
    })
  }

  return el
};

const createServicesCard = (props) => {
  const { id, title, oneWord, imgUrl } = props;

  const wrapperEl = createElement('div', { 
    id,
    classNames: ['col-md-4', 'col-sm-6', 'portfolio-item'] 
  });
  const aHrefEl = createElement('a', { 
    href: `#portfolio-modal-${id}`,
    classNames: ['portfolio-link'], 
    dataset: { toggle: 'modal' }
  });
  const captionEl = createElement('div', { 
    classNames: ['portfolio-caption'] 
  });
  const titleEl = createElement('h6', { 
    message: title
  });
  const descEl = createElement('p', { 
    message: oneWord,
    classNames: ['text-muted'], 
  });
  captionEl.appendChild(titleEl);
  captionEl.appendChild(descEl);

  const hoverEl = createElement('div', { 
    classNames: ['portfolio-hover'] 
  });
  const hoverContentEl = createElement('div', { 
    classNames: ['portfolio-hover-content'] 
  });
  const iconEl = createElement('i', { 
    classNames: ['fa', 'fa-key', 'fa-3x'] 
  });
  hoverContentEl.appendChild(iconEl);
  hoverEl.appendChild(hoverContentEl);

  const imgEl = createElement('img', { 
    classNames: ['img-fluid'],
    src: imgUrl
  });

  aHrefEl.appendChild(hoverEl);
  aHrefEl.appendChild(imgEl);
  wrapperEl.appendChild(aHrefEl);
  wrapperEl.appendChild(captionEl);

  return wrapperEl
}

const createServicesModal = (props) => {
  const { 
    id,
    title,
    oneWord,
    description,
    imgUrl,
    feeDescription,
    reserveUrl 
  } = props;

  const containerEl = createElement('div', { 
    id: `portfolio-modal-${id}`,
    classNames: ['portfolio-modal', 'modal', 'fade'],
    attributes: [ 
      {name: 'tabindex', value: -1},
      {name: 'role', value: 'dialog'},
      {name: 'aria-hidden', value: true}
    ]
  });
  const wrapperEl = createElement('div', {
    classNames: ['modal-dialog']
  })
  const contentEl = createElement('div', {
    classNames: ['modal-content']
  })
  const closeButtonContainerEl = createElement('div', {
    classNames: ['close-modal'],
    dataset: { dismiss: 'modal' }
  })
  const closeLrEl = createElement('div', {
    classNames: ['lr']
  })
  const closeRlEl = createElement('div', {
    classNames: ['rl']
  })

  const modalBodyContainerEl = createElement('div', {
    classNames: ['container']
  })
  const modalBodyWrapperEl = createElement('div', {
    classNames: ['row']
  })
  const modalBodyContentEl = createElement('div', {
    classNames: ['col-lg-8', 'mx-auto']
  })
  const modalBodyEl = createElement('div', {
    classNames: ['modal-body']
  })
  const titleEl = createElement('h4', { 
    message: title
  });
  const descEl = createElement('p', { 
    message: oneWord,
    classNames: ['item-intro', 'text-muted'],
  });
  const imgEl = createElement('img', { 
    classNames: ['img-fluid', 'd-block', 'mx-auto'],
    src: imgUrl
  });
  const detailEl = createElement('p', { 
    message: description,
    classNames: ['text-muted'],
  });
  const feeTitleEl = createElement('h5', { 
    message: '收費',
    classNames: ['font-weight-bold'],
  });
  const feeContentEl = createElement('ul', { 
    classNames: ['list-inline'],
  });
  const feeEl = createElement('li', { 
    message: feeDescription.fee,
  });
  const breakEl = createElement('li', { 
    message: '-',
  });
 
  feeContentEl.appendChild(feeEl)
  feeContentEl.appendChild(breakEl)

  if (feeDescription.limited) {
    const limitedEl = createElement('li', { 
      message: `${feeDescription.limited}`,
      classNames: ['text-success']
    });
    feeContentEl.appendChild(limitedEl)
  }

  if (feeDescription.limited && feeDescription.discount) {
    const brEl = createElement('br');
    feeContentEl.appendChild(brEl);
  }

  if (feeDescription.discount) {
    const discountEl = createElement('li', { 
      message: feeDescription.discount
    });
    feeContentEl.appendChild(discountEl)
  }

  const buttonEl = createElement('a', { 
    message: '去預約',
    href: reserveUrl,
    classNames:['btn', 'btn-info', 'btn-lg'],
    attributes: [ 
      {name: 'target', value: '_blank'},
      {name: 'role', value: 'button'}
    ]
  });

  closeLrEl.appendChild(closeRlEl)
  closeButtonContainerEl.appendChild(closeLrEl)

  modalBodyEl.appendChild(titleEl);
  modalBodyEl.appendChild(descEl);
  modalBodyEl.appendChild(imgEl);
  modalBodyEl.appendChild(detailEl);
  modalBodyEl.appendChild(feeTitleEl);
  modalBodyEl.appendChild(feeContentEl);
  modalBodyEl.appendChild(buttonEl);
  modalBodyContentEl.appendChild(modalBodyEl);
  modalBodyWrapperEl.appendChild(modalBodyContentEl);
  modalBodyContainerEl.appendChild(modalBodyWrapperEl);

  contentEl.appendChild(closeButtonContainerEl);
  contentEl.appendChild(modalBodyContainerEl);
  wrapperEl.appendChild(contentEl);
  containerEl.appendChild(wrapperEl);

  return containerEl
}

const createNavItem = (props) => {
  const { id, nav } = props;
  const liEl = createElement('li', { 
    classNames: ['nav-item']
  });
  const aHrefEl = createElement('a', {
    href: `#${id}`,
    classNames: ['nav-link', 'js-scroll-trigger'],
    message: nav
  });
  
  liEl.appendChild(aHrefEl);

  aHrefEl.addEventListener('click', () => {
    const el = document.querySelector(`#${id}`);
    const  navbarResponsive = document.querySelector('#navbarResponsive')
    navbarResponsive.classList.remove('show')
    navbarResponsive.classList.add('collapse')
    
    const mainNav = document.querySelector('#mainNav');
    $('html, body').animate({
      scrollTop: el.offsetTop - mainNav.clientHeight
    }, 1500, "easeInOutExpo");
  })
  return liEl;
}
/**
 * const SERVICES = [
  {
    id: 'flower',
    title: '乾燥花經文相框',
    oneWord: '製作屬於你的質感經文相框！',
    imgUrl: 'https://lh3.googleusercontent.com/pw/AJFCJaW9eA9Ve12Dn5CcGczATJNUThQ4Oq1UPL8MaZlQgMDj1v93iLoKxzEkuffZhqRCtBX2WZFVjitG_79lKeRtvECVVXa5HZDX4K7Sfa70J0OLTQJcnJCPR3CYDxh7ch9VZhFOxtywBJjQJPQuyB1W0N0=w531-h355-s-no?authuser=0',
    description: '提供相框、乾燥花、經文貼卡等素材，讓大家創意發揮拼貼，製作專屬經文相框',
    feeDescription: {
      fee: '$900元／人 (60分鐘)',
      limited: '',
      discount: '報名兩項享100元折價<br>報名四項享200元折價'
    },
    reserveUrl: 'https://docs.google.com/forms/d/1PqqZepvJz5mTLvfZgYrZc2qqga3rVGqTeKTvLrGL0EY/viewform?edit_requested=true'
  }
]
 */