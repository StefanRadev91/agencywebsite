import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { Magnetic } from './magnetic';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,border-color] duration-(--dur-base) ease-out-expo disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:shadow-(--glow)',
  secondary: 'border border-border bg-transparent text-foreground hover:border-foreground',
  ghost: 'text-foreground hover:text-accent-ink',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };
type LinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', magnetic = true, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  let node: React.ReactNode;
  if (props.href !== undefined) {
    const {
      href,
      variant: _v,
      size: _s,
      magnetic: _m,
      className: _c,
      children: _ch,
      ...rest
    } = props;
    void [_v, _s, _m, _c, _ch];
    const external = /^(https?:|mailto:|tel:)/.test(href);
    node = external ? (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  } else {
    const { variant: _v, size: _s, magnetic: _m, className: _c, children: _ch, ...rest } = props;
    void [_v, _s, _m, _c, _ch];
    node = (
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    );
  }

  return magnetic ? <Magnetic>{node}</Magnetic> : node;
}
