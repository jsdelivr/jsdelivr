class CCImageLightbox {
    constructor() {
        this.store = {
            current: {
                galleryId: null,
                index: null
            },
            galleries: []
        };
        this.init();
    }

    _setCurrentOpenImage(galleryId, index) {
        this.store.current.galleryId = galleryId;
        this.store.current.index = index;
    }
    _getCurrentOpenImage() {
        return this.store.current;
    }
    _clearCurrentOpenImage() {
        this.store.current.galleryId = null;
        this.store.current.index = null;
    }
    _isCurrentOpenImage() {
        return this.store.current.galleryId !== null;
    }

    _getGallery(galleryId) {
        if (this.store[galleryId] === undefined || this.store[galleryId] === null) {
            this.store[galleryId] = [];
        }
        return this.store[galleryId];
    }

    _getImage(galleryId, index) {
        const gallery = this._getGallery(galleryId);
        if (gallery[index] === undefined || gallery[index] === null) {
            gallery[index] = {};
        }
        return gallery[index];
    }

    _isImage(galleryId, index) {
        const image = this._getImage(galleryId, index);
        return !(image.src === undefined || image.src === null);
    }

    _renderNextOrPreviousButton(galleryId, index, direction) {
        var self = this;
        const button  = document.createElement('div');
        button.setAttribute('class', 'cc-lightbox--' + direction);
        if (self._isImage(galleryId, index)) {
            button.setAttribute('class', direction === 'left' ? 'cc-lightbox--left cc-lightbox--left--has-previous' : 'cc-lightbox--right cc-lightbox--right--has-next');
            button.onclick = () => self.open(galleryId, index);
        }
        return button;
    };

    _generateId(galleryId, index) {
        return 'cc-lightbox--' + galleryId + '--' + index;
    }


    closeIfOpen() {
        const self = this;
        const lightboxWrapper = document.getElementsByClassName('cc-lightbox-wrapper');
        if (lightboxWrapper[0] !== undefined && lightboxWrapper[0] !== null) {
            lightboxWrapper[0].remove();
        }
        self._clearCurrentOpenImage();
    }

    open(galleryId, index) {
        this.closeIfOpen();
        this._setCurrentOpenImage(galleryId, index);
        this.create(galleryId, index);
    }

    create(galleryId, index) {
        const self = this;
        const indexInt = parseInt(index, 10);

        // WRAPPER
        const wrapper  = document.createElement('div');
        wrapper.setAttribute('class', 'cc-lightbox-wrapper');
        wrapper.setAttribute('data-cc-lightbox-gallery-id', galleryId);
        document.body.appendChild(wrapper);

        // TOPBAR
        const topBar  = document.createElement('div');
        topBar.setAttribute('class', 'cc-lightbox--top');
        wrapper.appendChild(topBar);

        // TITLEBAR
        const titleBar = document.createElement('div');
        titleBar.setAttribute('class', 'cc-lightbox--top-title');
        titleBar.innerHTML = self._getImage(galleryId, index).title;
        topBar.appendChild(titleBar);

        // CLOSEBUTTON
        const closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'cc-lightbox--top-close');
        closeButton.onclick = () => self.closeIfOpen();
        topBar.appendChild(closeButton);

        // PREVIOUS BUTTON
        wrapper.appendChild(self._renderNextOrPreviousButton(galleryId, (indexInt - 1), 'left'));

        // IMAGE
        const image  = document.createElement('div');
        image.setAttribute('class', 'cc-lightbox--image');
        wrapper.appendChild(image);
        const imageInner = document.createElement('div');
        imageInner.setAttribute('class', 'cc-lightbox--image-inner');
        image.appendChild(imageInner);
        const imageInnerWrap = document.createElement('div');
        imageInnerWrap.setAttribute('class', 'cc-lightbox--image-inner-wrap');
        imageInner.appendChild(imageInnerWrap);
        const img = document.createElement('img');
        img.onload = function () {
            image.setAttribute('class', 'cc-lightbox--image cc-lightbox--image-loaded');
        };
        img.setAttribute('src', self._getImage(galleryId, index).src);
        img.setAttribute('class', 'cc-lightbox--image-img');
        img.setAttribute('id', self._generateId(galleryId, index));
        imageInnerWrap.appendChild(img);

        // NEXT BUTTON
        wrapper.appendChild(self._renderNextOrPreviousButton(galleryId, (indexInt + 1), 'right'));

        return false;
    }

    init() {
        const self = this;
        const lightboxElements = document.querySelectorAll('[data-cc-lightbox]');

        for (let i = 0; i < lightboxElements.length; i++) {
            const lightboxElement = lightboxElements[i];
            const galleryId = lightboxElement.getAttribute('data-cc-lightbox');
            const nextIndex = self._getGallery(galleryId).length;
            const nextImage = self._getImage(galleryId, nextIndex);
            nextImage.title = lightboxElement.getAttribute('data-cc-title');
            nextImage.src = lightboxElement.parentNode.getAttribute('href');

            //
            // THUMBNAIL CLICK OPENS LIGHTBOX
            //
            lightboxElement.parentNode.onclick = () => {
                self.open(galleryId, nextIndex);
                return false;
            };
        }

        //
        // CLOSE ON ESCAPE KEY PRESS
        //
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 27) {
                self.closeIfOpen();
            }
            if (event.keyCode === 37) { // left
                if (self._isCurrentOpenImage()) {
                    const current = self._getCurrentOpenImage();
                    if (self._isImage(current.galleryId, current.index - 1)) {
                        self.open(current.galleryId, current.index - 1);
                    }
                }
            }
            if (event.keyCode === 39) { // right
                if (self._isCurrentOpenImage()) {
                    const current = self._getCurrentOpenImage();
                    if (self._isImage(current.galleryId, current.index + 1)) {
                        self.open(current.galleryId, current.index + 1);
                    }
                }
            }
        }, false);

    };
};

export default CCImageLightbox;