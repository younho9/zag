import * as PinInput from "@ui-machines/pin-input"
import { normalizeProps, SolidPropTypes, useMachine, useSetup } from "@ui-machines/solid"
import { createMemo, createUniqueId } from "solid-js"
import { StateVisualizer } from "../components/state-visualizer"

export default function Page() {
  const [state, send] = useMachine(
    PinInput.machine.withContext({
      autoFocus: true,
      onComplete(val) {
        console.log(val)
      },
    }),
  )

  const ref = useSetup<HTMLDivElement>({ send, id: createUniqueId() })

  const pinInput = createMemo(() => PinInput.connect<SolidPropTypes>(state, send, normalizeProps))

  return (
    <div>
      <div style={{ width: "300px" }} ref={ref} {...pinInput().containerProps}>
        <input {...pinInput().getInputProps({ index: 0 })} />
        <input {...pinInput().getInputProps({ index: 1 })} />
        <input {...pinInput().getInputProps({ index: 2 })} />
      </div>

      <StateVisualizer state={state} />
    </div>
  )
}
