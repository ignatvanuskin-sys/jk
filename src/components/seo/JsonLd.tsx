/**
 * Renders a JSON-LD block.
 *
 * `JSON.stringify` output is escaped for the `<` character so a string coming
 * from data can never terminate the script element early (the classic
 * `</script>` injection vector in structured data).
 */
export function JsonLd({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
