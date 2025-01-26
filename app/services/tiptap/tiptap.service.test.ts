import { test } from "node:test"
import { deepStrictEqual } from "node:assert"
import { tipTapService } from "./tiptap.service.js"
import { type JSONContent } from "novel"

test("extractImageUrls should return an empty array if input is null", () => {
  const result = tipTapService.extractImageUrls(null)
  deepStrictEqual(result, [])
})

test("extractImageUrls should return an empty array if input is undefined", () => {
  const result = tipTapService.extractImageUrls(undefined)
  deepStrictEqual(result, [])
})

test("extractImageUrls should return an empty array if there are no images", () => {
  const json: JSONContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Hello, world!"
          }
        ]
      }
    ]
  }
  const result = tipTapService.extractImageUrls(json)
  deepStrictEqual(result, [])
})

test("extractImageUrls should return an array of image URLs if images are present", () => {
  const json: JSONContent = {
    type: "doc",
    content: [
      {
        type: "image",
        attrs: {
          src: "https://example.com/image1.png"
        }
      },
      {
        type: "paragraph",
        content: [
          {
            type: "image",
            attrs: {
              src: "https://example.com/image2.png"
            }
          }
        ]
      }
    ]
  }
  const result = tipTapService.extractImageUrls(json)
  deepStrictEqual(result, [
    "https://example.com/image1.png",
    "https://example.com/image2.png"
  ])
})

test("extractImageUrls should handle nested content", () => {
  const json: JSONContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "image",
            attrs: {
              src: "https://example.com/image1.png"
            }
          },
          {
            type: "paragraph",
            content: [
              {
                type: "image",
                attrs: {
                  src: "https://example.com/image2.png"
                }
              }
            ]
          }
        ]
      }
    ]
  }
  const result = tipTapService.extractImageUrls(json)
  deepStrictEqual(result, [
    "https://example.com/image1.png",
    "https://example.com/image2.png"
  ])
})
