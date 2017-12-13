import {bulmaComponentGenerator as bulma} from 'vue-bulma-components'
import {mapGetters} from 'vuex'
import {findIndex} from 'lodash'
import {formatMoment} from '../../../src/shared/time'

import icon from '../../components/icon/icon.vue'
import flushImg from '../../components/flush-img/flush-img.vue'
import attributor from '../../components/footer/footer.vue'
import navbar from '../../components/navbar/navbar.vue'
import notification from '../../components/notification/notification.vue'
import bInput from '../../components/b-input/b-input.vue'

export default {
  'components': {
    'b-tile':              bulma('tile', 'div'),
    'b-container':         bulma('container', 'div'),
    'b-container-fluid':   bulma('container-fluid', 'div'),
    'b-box':               bulma('box', 'div'),
    'b-columns':           bulma('columns', 'div'),
    'b-column':            bulma('column', 'div'),
    'b-level':             bulma('level', 'div'),
    'b-level-left':        bulma('level-left', 'div'),
    'b-level-right':       bulma('level-right', 'div'),
    'b-section':           bulma('section', 'div'),
    'b-button':            bulma('button', 'button'),
    'b-content':           bulma('content', 'div'),
    'b-modal':             bulma('modal', 'div'),
    'b-modal-background':  bulma('modal-background', 'div'),
    'b-modal-content':     bulma('modal-content', 'div'),
    'b-modal-close':       bulma('modal-close', 'div'),
    'b-control':           bulma('control', 'div'),
    'b-card':              bulma('card', 'div'),
    'b-card-header':       bulma('card-header', 'div'),
    'b-card-header-title': bulma('card-header-title', 'div'),
    'b-card-header-icon':  bulma('card-header-icon', 'div'),
    'b-card-image':        bulma('card-image', 'div'),
    'b-card-content':      bulma('card-content', 'div'),
    'b-card-footer':       bulma('card-footer', 'div'),
    'b-card-footer-item':  bulma('card-footer-item', 'div'),
    attributor,
    navbar,
    flushImg,
    icon,
    notification,
    bInput
  },
  beforeMount () {
    this.$store.dispatch('getFullTheme', this.$route.params.id)
  },
  data () {
    return {
      'viewingSource':   false,
      'confirmTitle':    '',
      'showingModal':    false,
      'flickityOptions': {
        'wrapAround':      true,
        'prevNextButtons': false,
        'pageDots':        false,
        'cellAlign':       'left'
      }
    }
  },
  'methods': {
    formatMoment,
    proxyImage (original) {
      return {
        'large': `https://imageproxy.openusercss.org/none/${encodeURIComponent(original)}`,
        'small': `https://imageproxy.openusercss.org/blurred/${encodeURIComponent(original)}`
      }
    },
    confirmDeleteTheme () {
      this.confirmTitle = ''
      this.$modal.show('delete-theme')
    },
    cancelDelete () {
      this.$modal.hide('delete-theme')
    },
    deleteTheme () {
      this.$store.dispatch('deleteTheme', {
        'id':       this.viewedTheme._id,
        'redirect': `/profile/${this.viewedTheme.user._id}`
      })
    },
    viewSource () {
      this.$modal.show('source-viewer')
    },
    installTheme () {
      if (process.env.NODE_ENV === 'development') {
        window.open(`http://localhost:5000/theme/${this.viewedTheme._id}.user.css`)
      } else {
        window.open(`https://api.openusercss.org/theme/${this.viewedTheme._id}.user.css`)
      }
    }
  },
  'computed': {
    ...mapGetters([
      'actionErrors',
      'themes',
      'currentUser'
    ]),
    'viewedTheme': {
      'cache': false,
      get () {
        const themeIndex = findIndex(this.themes, (theme) => theme._id === this.$route.params.id)

        if (!this.themes[themeIndex]) {
          return {
            'user': {}
          }
        }
        return this.themes[themeIndex]
      }
    }
  }
}
