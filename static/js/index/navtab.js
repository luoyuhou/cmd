let navtab = $('nav.navtab');
let nabtabItems = $('li.navtab-item');

nabtabItems.map((index, item) => {
  $(item).on('click', function () {
    nabtabItems.map((i, v) => {
      if (i === index) {
        $(v).addClass('active');
        navtab.css('--active-index', `${i}`)
      } else {
        $(v).removeClass('active');
      }
    })
  })
});