/* eslint-disable @next/next/no-img-element -- 네이버 썸네일은 도메인이 여러 개라 next/image 대신 img 사용 */

export default function ProductImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  if (!src) {
    return <div className={`flex items-center justify-center bg-gray-100 text-3xl ${className}`}>🛍️</div>;
  }
  return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
}
