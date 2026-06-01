'use client'

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/27799381260"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="hidden sm:flex fixed bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#128C7E] hover:shadow-xl"
    >
      <ChatBubbleLeftRightIcon className="h-7 w-7" />
    </a>
  )
}

export default WhatsAppButton
