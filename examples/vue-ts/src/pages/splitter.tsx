import { injectGlobal } from "@emotion/css"
import * as splitter from "@zag-js/splitter"
import { normalizeProps, useMachine } from "@zag-js/vue"
import { defineComponent } from "@vue/runtime-core"
import { computed, h, Fragment } from "vue"
import { splitterControls, splitterStyle } from "@zag-js/shared"
import { StateVisualizer } from "../components/state-visualizer"
import { useControls } from "../hooks/use-controls"

import { Toolbar } from "../components/toolbar"

injectGlobal(splitterStyle)

export default defineComponent({
  name: "Splitter",
  setup() {
    const controls = useControls(splitterControls)

    const [state, send] = useMachine(splitter.machine({ id: "splitter" }), {
      context: controls.context,
    })

    const apiRef = computed(() => splitter.connect(state.value, send, normalizeProps))

    return () => {
      const api = apiRef.value
      return (
        <>
          <main>
            <div {...api.rootProps}>
              <div {...api.primaryPaneProps}>
                <div>
                  <small {...api.labelProps}>Table of Contents</small>
                  <p>Primary Pane</p>
                </div>
              </div>
              <div {...api.splitterProps}>
                <div class="splitter-bar" />
              </div>
              <div {...api.secondaryPaneProps}>Secondary Pane</div>
            </div>
          </main>

          <Toolbar controls={controls.ui} visualizer={<StateVisualizer state={state} />} />
        </>
      )
    }
  },
})
