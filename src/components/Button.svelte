<script lang="ts">
  interface Props {
    label: string;
    href: string;
  }

  let { label, href }: Props = $props();
</script>

<a
  {href}
  class="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-linear-to-b backdrop-blur-lg px-6 py-2 font-semibold shadow-lg border border-purple-700/50 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-purple-600/50 hover:border-purple-500"
>
  <span class="relative z-10 text-lg drop-shadow-lg">{label}</span>
  <div
    class="absolute inset-0 flex h-full w-full justify-center transform-[skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:transform-[skew(-13deg)_translateX(100%)]"
  >
    <div class="relative h-full w-10 bg-white/30"></div>
  </div>
</a>
