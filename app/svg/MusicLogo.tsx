import { HasClassName } from "~/common/interfaces"

interface MusicLogoProps extends HasClassName {}

export default function MusicLogo({ className }: MusicLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1015.4958 517.4838"
      height="517.48383"
      width="1015.4958"
    >
      <g transform="translate(-25.660378,-274.83789)" className="musicLogo-group">
        <path
          className="musicLogo-angleBracketLeft"
          d="M 25.660379,519.24532 268.17612,392.45286 v 57.86164 l -137.86164,69.43397 138.36479,72.95598 v 53.83648 z"
        />
        <path
          className="musicLogo-musicNote"
          d="m 602.86328,274.83789 -271.45703,50.6543 v 353.85742 c -8.11536,-2.80956 -28.24029,-6.70686 -54.67578,9.95898 -34.71698,21.88679 -48.55497,40.50342 -51.32227,53.08203 -2.76729,12.57863 3.77399,30.69101 19.62305,40.75391 15.84905,10.06289 42.76831,13.08205 63.90039,2.76758 21.13208,-10.31447 42.5149,-30.18866 51.06836,-50.31445 7.26061,-17.0838 6.54616,-28.09868 6.16406,-31.06446 V 406.79297 l 201.75977,-40.37695 v 258.52539 c -8.25584,-2.80207 -28.27741,-6.48561 -54.47656,10.03125 -34.71698,21.88679 -48.55497,40.50342 -51.32227,53.08203 -2.76729,12.57862 3.77399,30.69297 19.62305,40.75586 15.84905,10.06289 42.76831,13.08009 63.90039,2.76562 21.13208,-10.31446 42.5149,-30.18866 51.06836,-50.31445 7.3718,-17.34543 6.52209,-28.47475 6.14648,-31.23242 z"
        />
        <path
          className="musicLogo-forwardSlash"
          d="m 634.0881,749.81138 h 49.55975 l 80.62894,-458.86796 h -49.93711 z"
        />
        <path
          className="musicLogo-angleBracketRight"
          d="M 1041.1562,519.7492 798.64042,646.54165 V 588.68001 L 936.50206,519.24605 798.13727,446.29007 v -53.83648 z"
        />
      </g>
    </svg>
  )
}
