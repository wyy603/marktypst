<template>
  <div class="pref-markdown">
    <h4>Markdown</h4>
    <compound>
      <template #head>
        <h6 class="title">Lists:</h6>
      </template>
      <template #children>
        <bool
          description="Prefer loose list items"
          :bool="preferLooseListItem"
          :onChange="value => onSelectChange('preferLooseListItem', value)"
          more="https://spec.commonmark.org/0.29/#loose"
        ></bool>
        <cur-select
          description="Preferred marker for bullet lists"
          :value="bulletListMarker"
          :options="bulletListMarkerOptions"
          :onChange="value => onSelectChange('bulletListMarker', value)"
          more="https://spec.commonmark.org/0.29/#bullet-list-marker"
        ></cur-select>
        <cur-select
          description="Preferred marker for ordered lists"
          :value="orderListDelimiter"
          :options="orderListDelimiterOptions"
          :onChange="value => onSelectChange('orderListDelimiter', value)"
          more="https://spec.commonmark.org/0.29/#ordered-list"
        ></cur-select>
        <cur-select
          description="Preferred list indentation"
          :value="listIndentation"
          :options="listIndentationOptions"
          :onChange="value => onSelectChange('listIndentation', value)"
        ></cur-select>
      </template>
    </compound>

    <compound>
      <template #head>
        <h6 class="title">Markdown extensions:</h6>
      </template>
      <template #children>
        <cur-select
          description="Front matter format"
          :value="frontmatterType"
          :options="frontmatterTypeOptions"
          :onChange="value => onSelectChange('frontmatterType', value)"
        ></cur-select>
        <bool
          description="Enable Pandoc-style superscript and subscript"
          :bool="superSubScript"
          :onChange="value => onSelectChange('superSubScript', value)"
          more="https://pandoc.org/MANUAL.html#superscripts-and-subscripts"
        ></bool>
        <bool
          description="Enable Pandoc-style footnotes"
          notes="Requires restart."
          :bool="footnote"
          :onChange="value => onSelectChange('footnote', value)"
          more="https://pandoc.org/MANUAL.html#footnotes"
        ></bool>
      </template>
    </compound>

    <compound>
      <template #head>
        <h6 class="title">Compatibility:</h6>
      </template>
      <template #children>
        <bool
          description="Enable HTML rendering"
          :bool="isHtmlEnabled"
          :onChange="value => onSelectChange('isHtmlEnabled', value)"
        ></bool>
        <bool
          description="Enable GitLab compatibility mode"
          :bool="isGitlabCompatibilityEnabled"
          :onChange="value => onSelectChange('isGitlabCompatibilityEnabled', value)"
        ></bool>
      </template>
    </compound>

    <compound>
      <template #head>
        <h6 class="title">Diagrams:</h6>
      </template>
      <template #children>
        <cur-select
          description="Sequence diagram theme"
          :value="sequenceTheme"
          :options="sequenceThemeOptions"
          :onChange="value => onSelectChange('sequenceTheme', value)"
          more="https://bramp.github.io/js-sequence-diagrams/"
        ></cur-select>
      </template>
    </compound>

    <compound>
      <template #head>
        <h6 class="title">Misc:</h6>
      </template>
      <template #children>
        <cur-select
          description="Preferred heading style"
          :value="preferHeadingStyle"
          :options="preferHeadingStyleOptions"
          :onChange="value => onSelectChange('preferHeadingStyle', value)"
          :disable="true"
        ></cur-select>
      </template>
    </compound>

    <div>
      <h5>Math</h5>

      <text-box description="typstPackagesPath" :input="typstPackagesPath"
        :regexValidator="/^(?:$|([a-zA-Z]:)?[\/\\].*$)/" :defaultValue="typstPackagesPathPlaceholder"
        :onChange="value => modifyTypstPackagesPath(value)"></text-box>
      <div>
        <el-button size="mini" @click="modifyTypstPackagesPath(undefined)">Open...</el-button>
        <el-button size="mini" @click="openTypstPackagesPath()">Show in Folder</el-button>
      </div>

      <text-box description="typstUserPackagesPath" :input="typstUserPackagesPath"
        :regexValidator="/^(?:$|([a-zA-Z]:)?[\/\\].*$)/" :defaultValue="typstUserPackagesPathPlaceholder"
        :onChange="value => modifyTypstUserPackagesPath(value)"></text-box>
      <div>
        <el-button size="mini" @click="modifyTypstUserPackagesPath(undefined)">Open...</el-button>
        <el-button size="mini" @click="openTypstUserPackagesPath()">Show in Folder</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'
import Compound from '../common/compound'
import Separator from '../common/separator'
import { mapState } from 'vuex'
import Bool from '../common/bool'
import CurSelect from '../common/select'
import TextBox from '@/prefComponents/common/textBox'
import {
  bulletListMarkerOptions,
  orderListDelimiterOptions,
  preferHeadingStyleOptions,
  listIndentationOptions,
  frontmatterTypeOptions,
  sequenceThemeOptions
} from './config'

export default {
  components: {
    Compound,
    Separator,
    Bool,
    CurSelect,
    TextBox
  },
  data () {
    this.bulletListMarkerOptions = bulletListMarkerOptions
    this.orderListDelimiterOptions = orderListDelimiterOptions
    this.preferHeadingStyleOptions = preferHeadingStyleOptions
    this.listIndentationOptions = listIndentationOptions
    this.frontmatterTypeOptions = frontmatterTypeOptions
    this.sequenceThemeOptions = sequenceThemeOptions
    return {}
  },
  computed: {
    ...mapState({
      typstPackagesPath: state => state.preferences.typstPackagesPath,
      typstUserPackagesPath: state => state.preferences.typstUserPackagesPath,
      preferLooseListItem: state => state.preferences.preferLooseListItem,
      bulletListMarker: state => state.preferences.bulletListMarker,
      orderListDelimiter: state => state.preferences.orderListDelimiter,
      preferHeadingStyle: state => state.preferences.preferHeadingStyle,
      listIndentation: state => state.preferences.listIndentation,
      frontmatterType: state => state.preferences.frontmatterType,
      superSubScript: state => state.preferences.superSubScript,
      footnote: state => state.preferences.footnote,
      isHtmlEnabled: state => state.preferences.isHtmlEnabled,
      isGitlabCompatibilityEnabled: state => state.preferences.isGitlabCompatibilityEnabled,
      sequenceTheme: state => state.preferences.sequenceTheme
    }),
    typstPackagesPathPlaceholder: {
      get: function () {
        return this.$store.state.preferences.typstPackagesPath || ''
      }
    },
    typstUserPackagesPathPlaceholder: {
      get: function () {
        return this.$store.state.preferences.typstUserPackagesPath || ''
      }
    },
  },
  methods: {
    onSelectChange (type, value) {
      this.$store.dispatch('SET_SINGLE_PREFERENCE', { type, value })
    },
    modifyTypstPackagesPath (value) {
      return this.$store.dispatch('SET_TYPST_PACKAGES_PATH', value)
    },
    modifyTypstUserPackagesPath (value) {
      return this.$store.dispatch('SET_TYPST_LOCAL_PACKAGES_PATH', value)
    },
    openTypstPackagesPath (path) {
      shell.openPath(this.typstPackagesPath)
    },
    openTypstUserPackagesPath (value) {
      shell.openPath(this.typstUserPackagesPath)
    },
  }
}
</script>

<style scoped>
  .pref-markdown {
  }
</style>
