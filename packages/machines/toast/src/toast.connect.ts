import { StateMachine as S } from "@ui-machines/core"
import { normalizeProp, PropTypes, ReactPropTypes } from "@ui-machines/types"
import { dataAttr } from "@ui-machines/dom-utils"
import { dom } from "./toast.dom"
import { ToastMachineContext, ToastMachineState } from "./toast.types"

export function toastConnect<T extends PropTypes = ReactPropTypes>(
  state: S.State<ToastMachineContext, ToastMachineState>,
  send: (event: S.Event<S.AnyEventObject>) => void,
  normalize = normalizeProp,
) {
  const { context: ctx } = state
  const isVisible = state.matches("active", "active:temp", "visible")

  return {
    type: ctx.type,
    placement: ctx.placement,
    isVisible,

    pause() {
      send("PAUSE")
    },

    resume() {
      send("RESUME")
    },

    dismiss() {
      send("DISMISS")
    },

    progressProps: normalize.element<T>({
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": ctx.progress?.max,
      "aria-valuenow": ctx.progress?.value,
    }),

    containerProps: normalize.element<T>({
      id: dom.getRootId(ctx),
      "data-open": dataAttr(isVisible),
      "data-type": ctx.type,
      style: {
        pointerEvents: "auto",
        margin: "calc(var(--toast-gutter) / 2)",
        "--toast-remove-delay": `${ctx.removeDelay}ms`,
      },
      onPointerEnter() {
        if (ctx.pauseOnHover) {
          send("PAUSE")
        }
      },
      onPointerLeave() {
        if (ctx.pauseOnHover) {
          send("RESUME")
        }
      },
    }),

    titleProps: normalize.element<T>({
      id: dom.getToastTitleId(ctx),
    }),
  }
}